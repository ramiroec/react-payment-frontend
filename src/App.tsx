import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

// Cargar Stripe con la clave pública de prueba
const stripePromise = loadStripe('pk_test_51NgfrlD0Flo7iVv5Dijkw5ZgDFLaptHsV0L1CuSdKAdamUIuTRu6diz25PfO9G1LTfhU3WrPvWMIOOU63WqfSYFD00pVrfewxq'); // Reemplaza con tu clave pública

const App = () => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
};

export default App;