// 解决 typescript 只能理解 .ts 文件，无法理解 .vue文件 问题
declare module "*.vue" {
  import { ComponentOptions } from "vue";
  const componentOptions: ComponentOptions;
  export default componentOptions;
}
