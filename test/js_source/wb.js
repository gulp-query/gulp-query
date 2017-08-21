export {q} from './w/q.js';

import styles from '../scss/app.scss';

class W {

  constructor()
  {

    q(2);

    this.a = 1;
    this.b = 2;
    this.c = 3;
  }

}

global.W = W;