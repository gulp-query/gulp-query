import {q} from './r/q';

class A {

  constructor()
  {
    this.a = 1;
  }

  log()
  {
    console.log(this.a);
    q(this.a);
  }
}

export let a = new A();