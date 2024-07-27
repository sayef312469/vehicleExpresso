/* eslint-disable react/prop-types */
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import React, { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import '../styles/modal.css'

const Modal = ({ row, Update, closeModal }) => {
  const { user } = useAuthContext()
  // eslint-disable-next-line no-unused-vars
  const [update, setUpdate] = Update
  const [mechanic, setMechanic] = useState(row.MECHANIC_NAME)
  const [repairCost, setRepairCost] = useState(row.REPAIR.COST)
  const [washCost, setWashCost] = useState(row.WASH.COST)
  const [laborCost, setLaborCost] = useState(0)
  const [laborHour, setLaborHour] = useState(row.LABOR_HOURS)
  const [status, setStatus] = useState(row.COMPLETED)
  // eslint-disable-next-line no-unused-vars
  const [err, setErr] = useState(null)

  const updateData = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/care/update-short`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: row.SERVICE_ID,
          mechanic: mechanic,
          repairCost: Number(repairCost),
          washCost: Number(washCost),
          labourHour: Number(laborHour),
          laborCost: Number(laborCost),
          status: status,
        }),
      })
      if (!response.ok) throw new Error('Error to update short-table')
      const jsonData = await response.json()
      setUpdate(jsonData)
      console.log(jsonData)
    } catch (err) {
      console.error(err)
      setErr(err.message)
    }
  }

  const HandleSubmit = () => {
    closeModal()
    updateData()
  }
  const HandleGenerateBill = (e) => {
    e.preventDefault()
    const doc = new jsPDF()
    const columns = ['Service Type', 'Description', 'Service Cost(Tk)']
    const rows = [
      [`Repair`, `${row.REPAIR.TYPE}`, `${row.REPAIR.COST}`],
      [`Wash`, `${row.WASH.TYPE}`, `${row.WASH.COST}`],
      [``, `Labor Hour:${row.LABOR_HOURS} hr`, ``],
      [
        ``,
        `Labor Cost`,
        `${row.SERVICING_COST - (row.REPAIR.COST + row.WASH.COST)}`,
      ],
      [``, `Total Cost`, `${row.SERVICING_COST} `],
    ]

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text(`SHORTTERM CARE BILL`, 75, 20)
    doc.text(`Owner Name:${user.name.toUpperCase()}`, 20, 30)
    doc.text(`E-mail: ${user.email}`, 20, 40)
    doc.text(`Vehicle no: ${row.VEHICLENO}`, 20, 50)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.autoTable({
      startY: 70,
      head: [columns],
      body: rows,
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      bodyStyles: { textColor: 50 },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: { 2: { halign: 'right' } },
      theme: 'grid',
    })
    doc.text(`Your Total Cost: ${row.SERVICING_COST} Tk`, 14, 130)
    doc.save(`${row.VEHICLENO}.pdf`)
  }
  return (
    <div
      className="modal-container"
      onClick={(e) => {
        if (e.target.className === 'modal-container') closeModal()
      }}
    >
      <div className="modal">
        <form className="form-group">
          <fieldset>
            <h3>Edit Record</h3>
            <hr/>
            <div className>
              <label htmlFor="mechanic">Mechanic:</label>
              <input
                name="mechanic"
                value={mechanic}
                onChange={(e) => {
                  setMechanic(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="repair-cost">Repair Cost:</label>
              <input
                name="repair-cost"
                value={repairCost}
                onChange={(e) => {
                  setRepairCost(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="wash-cost">Wash Cost:</label>
              <input
                name="wash-cost"
                value={washCost}
                onChange={(e) => {
                  setWashCost(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="laborcost">Cost(per hour):</label>
              <input
                name="laborcost"
                value={laborCost}
                onChange={(e) => {
                  setLaborCost(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="laborhour">Labor Hours:</label>
              <input
                name="laborhour"
                value={laborHour}
                onChange={(e) => {
                  setLaborHour(e.target.value)
                }}
              />
            </div>
            <div>
              <label htmlFor="status">Status:</label>
              <select
                name="status"
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value)
                }}
              >
                <option value="NO">No</option>
                <option value="YES">Yes</option>
              </select>
            </div>
            <span style={{ color: 'red' }}>
              (Submit before generating the updated bill)
            </span>
            <div>
              <button onClick={HandleGenerateBill}>Generate Bill</button>
              <button onClick={HandleSubmit}>Submit</button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export default Modal
