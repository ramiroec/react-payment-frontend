import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PaymentForm = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    if (!stripe || !elements) {
      console.error('Stripe no ha cargado correctamente.');
      return;
    }

    setLoading(true);

    try {
      // Obtener el clientSecret desde el backend
      const response = await axios.post('http://localhost:3000/create-payment-intent', {
        amount: amount * 100, // Convertir a centavos
      });

      const { clientSecret } = response.data;

      // Confirmar el pago con Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        console.error(error);
        alert(`Error en el pago: ${error.message}`);
      } else if (paymentIntent.status === 'succeeded') {
        alert('¡Pago exitoso! Gracias por tu compra.');
      }
    } catch (error) {
      console.error(error);
      alert('Error al procesar el pago. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Simulador de Pagos</h1>
      <div style={styles.formGroup}>
        <label style={styles.label}>Monto en USD:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Ej: 50"
          style={styles.input}
          min="1"
        />
      </div>
      <div style={styles.formGroup}>
        <label style={styles.label}>Detalles de la tarjeta:</label>
        <div style={styles.cardElement}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      <button
        onClick={handlePayment}
        disabled={!stripe || loading}
        style={styles.button}
      >
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
    </div>
  );
};

// Estilos para mejorar la apariencia
const styles = {
  container: {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    color: '#333',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  cardElement: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    backgroundColor: '#f9f9f9',
  },
  button: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default PaymentForm;