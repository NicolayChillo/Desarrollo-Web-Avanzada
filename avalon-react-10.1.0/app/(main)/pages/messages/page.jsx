'use client';
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const MessagesPage = () => {
    //los estados
    const [messages, setMessages] = useState([]);
    
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem('messages')) || [];
        setMessages(saved);
    }, []);
    
    //borrar mensaje
    const clearMensaje = () => {
        localStorage.removeItem('messages');
        setMessages([]);
        alert('All messages have been cleared.');
    };

    return (
        <>
            <div className="card">
                <div className="flex justify-content-between align-items-center mb-4">
                    <h2 className="text-900 font-bold m-0">Revisar mensajes</h2>
                    <Button 
                        label="Clear Messages" 
                        icon="pi pi-trash" 
                        severity="danger"
                        onClick={clearMensaje}
                    />
                </div>

                <DataTable 
                    value={messages} 
                    paginator 
                    rows={10}
                    emptyMessage="No messages found."
                    className="p-datatable-gridlines"
                >
                    <Column field="name" header="Name" sortable />
                    <Column field="email" header="Email" sortable />
                    <Column field="message" header="Message" sortable />
                    <Column field="date" header="Date" sortable />
                </DataTable>
            </div>
        </>
    );
};

export default MessagesPage;
    

