


/// 抽离出这样的一个概念，这也是面向对象的一种思想
class ReactiveEffect {
  private _fn;

  constructor(fn) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    this._fn();
  }

}


const targetMap = new Map();
export function track(target, key) {
  // set
  // target -> key -> dep
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) {
    dep = new Set();
    depsMap.set(key, dep);
  }

  dep.add(activeEffect);
  // const dep = new Set();

}


let activeEffect;
export function effect(fn) {

  const _effect = new ReactiveEffect(fn);

  _effect.run();

}