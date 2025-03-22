import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import './App.css'; // Importar el archivo CSS

const PaymentForm = () => {
  const [amount, setAmount] = useState(100);
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
    <div className="payment-container">
      <h1 className="payment-title">Comprar Producto</h1>
      <img
        src="https://static.nike.com/a/images/c_limit,w_592,f_auto/t_product_v1/c10cdd96-35fd-46da-9c08-7ef19a13a142/calzado-de-running-en-carretera-zoom-fly-5-FN45PX.png" // URL de la imagen del producto
        alt="Producto"
        className="product-image"
      />
      <div className="form-group">
        <label className="form-label">Monto en USD:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Ej: 50"
          className="form-input"
          min="1"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Detalles de la tarjeta:</label>
        <div className="card-element">
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </div>
      </div>
      <button
        onClick={handlePayment}
        disabled={!stripe || loading}
        className="payment-button"
      >
        {loading ? 'Procesando...' : 'Pagar'}
      </button>
      {loading && <p className="loading-message">Por favor, espera...</p>}
    </div>
  );
};

export default PaymentForm;