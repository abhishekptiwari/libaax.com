const Axios = require('axios');
const paymentHandler = async e => {
  const API_URL = 'http://localhost:8000/';
  e.preventDefault();
  const orderUrl = `${API_URL}order`;
  const response = await Axios.get(orderUrl);
  const { data } = response;
  const options = {
    key: process.env.RAZOR_PAY_KEY_ID,
    name: 'Your App Name',
    description: 'Some Description',
    order_id: data.id,
    handler: async response => {
      try {
        const paymentId = response.razorpay_payment_id;
        const url = `${API_URL}capture/${paymentId}`;
        const captureResponse = await Axios.post(url, {});
        console.log(captureResponse.data);
      } catch (err) {
        console.log(err);
      }
    },
    theme: {
      color: '#686CFD',
    },
  };
  const rzp1 = new window.Razorpay(options);
  rzp1.open();
};
