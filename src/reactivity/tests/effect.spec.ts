import { effect } from "../effect";
import { reactive } from "../reactive";


describe('effect', () => {

  it('happy path', () => {
    const user = reactive({
      age: 10
    });

    let nextAge;
    effect(() => {
      nextAge = user.age + 1;
    })

    expect(nextAge).toBe(11);

    // update
    user.age++;
    expect(nextAge).toBe(12);
  });


  it('should return runner when  call effect', () => {
    // 1.effect(fn) -> function (runner) -> fn -> return
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return 'foo';
    });
    expect(foo).toBe(11);
    const res = runner();
    expect(foo).toBe(12);
    expect(res).toBe('foo');
  });

  it('scheduler', () => {
    // 1.通过 effect 的第二个参数给定一个 scheduler 的 fn
    // 2.effect 第一次执行的时候还会执行 fn
    // 3.当响应式对象set，update 不会执行 fn，而是执行 scheduler
    // 4.如果执行 runner 的时候，会再次执行 fn
    let dummy;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({ foo: 1 });
    const runner = effect(() => {
      dummy = obj.foo;
    }, { scheduler });
    expect(scheduler).not.toHaveBeenCalled();
    expect(dummy).toBe(1);
    obj.foo++;
    expect(dummy).toBe(1);
    run();
    expect(dummy).toBe(2);



  });
});