/*import axios from 'axios';

const api = axios.create({
  baseURL: 'http://isha-doc-alb-604218210.us-west-1.elb.amazonaws.com/api',   
  withCredentials: true
});

export default api;

*/
import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true
});

export default api;
