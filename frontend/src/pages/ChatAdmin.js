import { useState, useRef ,useEffect} from "react";
import { Box , List , ListItem, TextField, Avatar, Typography , ButtonBase, Button, Paper, IconButton, Slide} from "@mui/material";
import '../styles/chat.css';
import socket from "../services/socket";
import { useAuthContext } from "../hooks/useAuthContext";
import SearchIcon from '@mui/icons-material/Search';

const ChatAdmin = () => {
    const adminUrl = 'https://www.shutterstock.com/image-vector/user-icon-vector-600nw-393536320.jpg';
    const [contacts, setContacts ] = useState([]);
    const [tempCont, setTempCont] = useState([]);
    const {user} = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [currContact, setCurrContact] = useState(null);
    const [currId, setCurrId] = useState(null);
    const [currImageUrl, setCurrImageUrl] = useState(null);
    const endofmessageRef = useRef(null);
    const [unread, setUnread] = useState({}); 
    const [open,setOpen] = useState(false);
    const [isFirstRender, setISFirstRender] = useState(true);
    const [newMessage, setNewMessage] = useState({
        userId: user.id,
        imageUrl: adminUrl,
        text: ''
    });

    useEffect(()=>{
        const fetchContacts = async()=>{
            try{
                socket.emit('admins active',{userId: user.id});
                const response = await fetch('http://localhost:4000/api/care/contacts',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: user.id
                    })
                })
                if(!response.ok) throw new Error('fetch failure');
                const jsonData = await response.json();
                console.log(jsonData);

                setISFirstRender(false);
                setContacts([]);
                setTempCont([]);
                
                const contactsObj = jsonData.contacts.map((contact,key)=>({
                    id: contact.USERID,
                    name: contact.NAME,
                    avatarUrl: contact.IMAGEURL,
                    latestMessage: contact.TEXT,
                }))

                contactsObj.forEach((contact,key)=> {
                    if(key<jsonData.unread){
                        setUnread(prevState=>({
                            ...prevState,
                            [contact.id] : true
                        }))
                    }
                });
                
                setContacts(prevContacts=>
                    ([...prevContacts,...contactsObj])
                )
                setTempCont(prevContacts=>
                    ([...prevContacts,...contactsObj]));
            }catch(err){
                console.error(err);
            }
        }
        fetchContacts();
    },[])

    useEffect(()=>{
        const storeUnread = async()=>{
            try{
                if(isFirstRender) return;
                const response = await fetch('http://localhost:4000/api/care/unread-contacts',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        user_id: user.id,
                        count: Object.keys(unread).length
                    })
                })
                const jsonData =  await response.json();
                console.log(jsonData);
            }catch(err){
                console.error(err);
            }
        }
        storeUnread();
    },[unread])

    useEffect(()=>{
        endofmessageRef.current?.scrollIntoView({behaviour: 'smooth'});
    },[messages])

    useEffect(()=>{
        socket.on('careUser chat',({name, userId,imageUrl, text})=>{
                const newmsg = {
                    userId: userId,
                    imageUrl: imageUrl,
                    text: text
                };
                const contactObj = {
                    id: userId,
                    name: name,
                    avatarUrl: imageUrl,
                    latestMessage: text,
                }
                setContacts(prevContacts=>{
                    const filteredContacts = prevContacts.filter(contact => contact.id !== userId)
                    return [contactObj,...filteredContacts]
                })
                setTempCont(prevContacts=>{
                    const filteredContacts = prevContacts.filter(contact => contact.id !== userId)
                    return [contactObj,...filteredContacts]
                });
                if(currId===userId)setMessages(prevMsgs=>([...prevMsgs, newmsg]));
                else{
                    setISFirstRender(false);
                    setUnread(prevState=>({
                        ...prevState,
                        [userId] : true
                    }))
                }
        })
        return ()=>{
            socket.off('careUser chat');
        }
    },[contacts,currId])

    const handleClose = ()=>{
        setOpen(!open);
        setTempCont(contacts);
    }

    const fetchOldChats = async(userid,username,imageurl)=>{
        setCurrContact(username);
        setCurrId(userid);
        setCurrImageUrl(imageurl);
        setISFirstRender(false);
        setUnread(prevState=>{
            const newUnread = {...prevState};
            delete newUnread[userid];
            return newUnread;
        })
        try{
            const response = await fetch('http://localhost:4000/api/care/old-chats',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: JSON.stringify({
                    userId: userid,
                    adminId: user.id
                })
            })
            if(!response.ok) throw new Error('network error')
            const jsonData = await response.json();
            setMessages([]);
            const oldChatsObj = jsonData?.oldChats?.map((chat)=>({
                userId: chat.ADMIN_ID < 0 ?chat.USER_ID:chat.ADMIN_ID,
                imageUrl: chat.ADMIN_ID < 0 ? imageurl:adminUrl,
                text: chat.TEXT
            }))
            setMessages(prevMsgs=>([...prevMsgs,...oldChatsObj]));
        }catch(err){
            console.error('fetch failed');
        }
    }

    const handleSendMessage = () => {
        if (newMessage.text.trim() && currContact) {
          setMessages(prevMsgs=>([...prevMsgs, newMessage]));
          setNewMessage(prevMsg=>({
            ...prevMsg,
            text: ''
          }));

          socket.emit('careAdmin chat',{
            adminId: user.id,
            userId: currId, 
            text: newMessage.text});
        }
        console.log(messages);
      };


    const handleContactSearch = (filterterm)=>{
        if(filterterm===''){
            setTempCont(contacts);
            return;
        }
        const results = contacts.filter(contact=>{
            return contact.name.toLowerCase().includes(filterterm.toLowerCase());
        })
        setTempCont(results);
    }

    return ( 
    <div className="chatrecord">
        <Box
        style={{
            width: '15%',
            minWidth: '80px',
            height: '100%',
            border: '1px solid cadetblue',
            borderRadius: '16px 0 0 16px'}}>
            
            <Box style={{ backgroundColor: 'cadetblue', 
            color: 'black', 
            borderRadius: '16px 0 0 0' , 
            height: '55px', 
            padding: '10px',
            display: 'flex',
            margin: 'auto',
            alignItems: 'center'}}>
            <IconButton 
            color="primary" 
            onClick={handleClose}
            aria-label="search">
                <SearchIcon/>
            </IconButton>

            <Slide direction="left" in={open} mountOnEnter unmountOnExit>
                <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 50,
                    p: 1,
                    width: 300,
                    backgroundColor: 'background.paper',
                    borderRadius: 1,
                    boxShadow: 1,
                    zIndex: 3
                }}>
                <TextField 
                    fullWidth 
                    variant="outlined" 
                    placeholder="Search..." 
                    autoFocus
                    onChange={(e)=>handleContactSearch(e.target.value)}/>
                </Box>
            </Slide>
            <Typography variant="h6" sx={{margin: 'auto'}}>Contact</Typography>
        </Box>
        <div style={{overflowY: 'auto',height: 'calc(100% - 60px)'}}>
        <List >
            {tempCont?.map((contact) => (
            <ButtonBase className="contact-holder"
                key={contact.id}
                style={{
                    backgroundColor: contact.id!==currId?'': 'lightblue',
                    border: '1px solid #ddd',
                    width: '95%',
                    padding: '10px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    margin: '1px auto',
                }}
                onClick={()=>fetchOldChats(contact.id, contact.name, contact.avatarUrl)}
                >   
                <Avatar alt={contact.name} src={contact.avatarUrl} sx={{ marginRight: '10px',
                                                                            fontWeight: unread[contact.id]?
                                                                             'bolder'
                                                                            :'normal'}} />
                <Box className='listname-holder'>
                <Typography variant="body1" >{contact.name}</Typography>
                <Typography variant="body2" color="textSecondary" sx={{fontWeight: unread[contact.id]?
                                                                          'bolder'
                                                                        : 'normal'}}>
                    {contact.latestMessage}
                </Typography>
                </Box>
            </ButtonBase>
            ))}
           <ListItem ref={endofmessageRef} />
        </List>
        </div>
        </Box> 

        {/* chat */}
        <Paper
            elevation={4}
            style={{
                flex: '1',
                height: '100%',
                overflowY: 'auto',
                border: '1px solid cadetblue',
                borderRadius: '0 16px 16px 0',
                display: 'flex',
                flexDirection: 'column'
            }}>

            <Box style={{ 
                backgroundColor: 'cadetblue', 
                color: 'black', 
                borderRadius: '0 10px 0 0' , 
                height: '55px', 
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px'}}>
                <Avatar src={currImageUrl}></Avatar>
                <Typography variant="h6">{currContact}</Typography>
            </Box>

            <List style={{ flex: 1, overflowY: 'auto', padding: '0 0', height: '80%',width: '100%'}}>
                {currId && messages.map((message, index) => (
                    <ListItem key={index} style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: user.id!==message.userId ? 'row': 'row-reverse'
                    }}>
                    <Avatar alt="User" 
                    src={message.imageUrl}
                    style={{ margin: '8px' }}/>
                    <Box
                    style={{
                        backgroundColor:user.id!==message.userId ? '#0084FF': '#ddd',
                        borderRadius: '18px',
                        padding: '10px',
                        maxWidth: '70%',
                        wordWrap: 'break-word',
                        display: 'inline-block',}}>
                        <Typography variant="body1" >{message.text}</Typography>
                    </Box>
                    </ListItem>
                ))}
                <ListItem ref={endofmessageRef} />
            </List>

            <Box p={2} style={{width: '100%', display: 'flex'}}>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Type a message..."
                    value={newMessage.text}
                    onChange={(e) => setNewMessage(prevMsg=>({
                        ...prevMsg,
                        text: e.target.value,
                    }))}
                    onKeyPress={(e) => {
                        console.log(e.target.value);
                    if (e.key === 'Enter') handleSendMessage();
                    }}/>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleSendMessage} 
                    style={{ marginLeft: '8px' }}>
                        Send
                </Button>
            </Box>
        </Paper> 
    </div> );
}
 
export default ChatAdmin;