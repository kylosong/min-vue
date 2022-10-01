


/// 抽离出这样的一个概念，这也是面向对象的一种思想
class ReactiveEffect {
  private _fn;

  constructor(fn, public scheduler?) {
    this._fn = fn;
  }

  run() {
    activeEffect = this;
    return this._fn();
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

}

// 基于 target，key，查找到之前收集到的 fn 进行遍历
export function trigger(target, key) {
  let depsMap = targetMap.get(target);
  let dep = depsMap.get(key);
  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}


let activeEffect;
export function effect(fn, options: any = {}) {

  const scheduler = options.scheduler;

  const _effect = new ReactiveEffect(fn, scheduler);

  _effect.run();

  return _effect.run.bind(_effect);

}