import { useState , useEffect, useRef} from "react";
import { Box, TextField, Button, List, ListItem, Paper, Typography, Avatar } from '@mui/material';
import socket from "../services/socket";
import { useAuthContext } from "../hooks/useAuthContext";

const ChatUI = ({imageUrl}) => {
    const {user} = useAuthContext();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState({
        userId: user.id,
        imageUrl: imageUrl,
        text: ''
    });
    const endofmessageRef = useRef(null);

    useEffect(()=>{
        socket.on('careAdmin chat',({adminId, imageUrl, text})=>{
            console.log(adminId, imageUrl, text);
            const newMsg = {
                userId: adminId,
                imageUrl: imageUrl,
                text: text
            }
            setMessages(prevMsgs=>([...prevMsgs, newMsg]));
        })
        return ()=>{
          socket.off('careAdmin chat');
        }
    },[])

    useEffect(()=>{
        const fetchOldChats = async()=>{
            try{
                const response = await fetch('http://localhost:4000/api/care/old-chats',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({
                        userId: user.id
                    })
                })
                if(!response.ok) throw new Error('fetch failed')
                const jsonData = await response.json();
                console.log(jsonData.oldChats);
                setMessages([]);
                const oldChatsObj = jsonData?.oldChats?.map((chat)=>({
                    userId: chat.ADMIN_ID < 0 ?chat.USER_ID:chat.ADMIN_ID,
                    imageUrl: chat.ADMIN_ID < 0 ? imageUrl:'',
                    text: chat.TEXT
                }))
                setMessages(prevMsgs=>([...prevMsgs,...oldChatsObj]));
            }catch(err){
                console.error(err);
            }
        }
        fetchOldChats();
    },[])

    const handleSendMessage = () => {
        if (newMessage.text) {
          setMessages(prevMsgs=>([...prevMsgs, newMessage]));
          setNewMessage(prevMsg=>({
            ...prevMsg,
            text: ''
        }));
          console.log(messages);
          socket.emit('careUser chat',{
            name: user.name,
            userId: user.id,
            text: newMessage.text,
          })
        }
      };

    useEffect(()=>{
        endofmessageRef.current?.scrollIntoView({behaviour: 'smooth'});
        console.log('done');
    },[messages])
    return ( 
        <Paper
        elevation={4}
        style={{
          position: 'fixed',
          bottom: 85,  // Adjust to make space for the button
          right: 16,
          width: '350px',
          height: '500px',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '10px',
        }}
      >
        {/* Chat Header */}
        <Box p={2} style={{ backgroundColor: 'cadetblue', color: 'black', borderRadius: '10px 10px 0 0' }}>
          <Typography variant="h6">Chat</Typography>
        </Box>

        {/* Messages List */}
        <List style={{ flex: 1, overflowY: 'auto', padding: '0 0' }}>
          {messages.map((message, index) => (
            <ListItem key={index} style={{ 
                display: 'flex',
                alignItems: 'center',
                flexDirection: user.id!==message.userId? 'row': 'row-reverse' 
            }}>
              <Avatar alt="User" 
              src={message.imageUrl} 
              style={{ margin: '8px' }}/>
              <Box
              style={{
                backgroundColor:user.id!==message.userId? '#0084FF': '#ddd',
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

        {/* Message Input */}
        <Box p={2} style={{ display: 'flex' }}>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Type a message..."
            value={newMessage.text}
            onChange={(e) => setNewMessage(prevMsg=>({
                ...prevMsg,
                text: e.target.value
            }))}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <Button variant="contained" color="primary" onClick={handleSendMessage} style={{ marginLeft: '8px' }}>
            Send
          </Button>
        </Box>
      </Paper>);
}
 
export default ChatUI;