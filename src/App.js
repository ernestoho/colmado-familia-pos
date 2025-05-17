import React, { useState, useEffect } from 'react';

const App = () => {
  const [clientes, setClientes] = useState(() => JSON.parse(localStorage.getItem('clientes')) || []);
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [ventas, setVentas] = useState(() => JSON.parse(localStorage.getItem('ventas')) || []);

  useEffect(() => {
    localStorage.setItem('clientes', JSON.stringify(clientes));
    localStorage.setItem('ventas', JSON.stringify(ventas));
  }, [clientes, ventas]);

  const agregarCliente = () => {
    if (!nombre) return;
    setClientes([...clientes, { id: Date.now(), nombre, credito: 0 }]);
    setNombre('');
  };

  const registrarVenta = (id) => {
    const valor = parseFloat(monto);
    if (!valor || valor <= 0) return;
    const nuevasVentas = [...ventas, { id: Date.now(), clienteId: id, monto: valor, fecha: new Date().toISOString() }];
    setVentas(nuevasVentas);
    setClientes(clientes.map(c => c.id === id ? { ...c, credito: c.credito + valor } : c));
    setMonto('');
  };

  const marcarPagado = (id) => {
    setClientes(clientes.map(c => c.id === id ? { ...c, credito: 0 } : c));
  };

  const enviarWhatsApp = (cliente) => {
    const mensaje = `Hola ${cliente.nombre}, recuerde que tiene un crédito pendiente de $${cliente.credito}. Gracias - Colmado Familia`;
    const url = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h2>Colmado Familia POS</h2>
      <input
        type="text"
        placeholder="Nombre del cliente"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button onClick={agregarCliente}>Agregar Cliente</button>
      <hr />
      {clientes.map(cliente => (
        <div key={cliente.id} style={{ marginBottom: 10 }}>
          <strong>{cliente.nombre}</strong> - Crédito: ${cliente.credito}
          <br />
          <input
            type="number"
            placeholder="Monto de venta"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
          <button onClick={() => registrarVenta(cliente.id)}>Registrar Venta</button>
          <button onClick={() => marcarPagado(cliente.id)}>Marcar Pagado</button>
          <button onClick={() => enviarWhatsApp(cliente)}>WhatsApp</button>
        </div>
      ))}
    </div>
  );
};

export default App;
