import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    ramp_up: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '20s', target: 10 },  
        { duration: '25s', target: 30 },
        { duration: '30s', target: 50 },  
        { duration: '10s', target: 0 },   
      ],
    },
  },
};

export default function() {
  http.get('https://www.echoesofaurora.com/stories');
  sleep(1);
  http.get('https://www.echoesofaurora.com/tribes');
  sleep(1);
}
