import magicArea from "./magic-area.vue";

function install(Vue, router, routeDatas, devServerPort, moreConfigs = {}) {
  const magicAreaEl = document.createElement("div");
  magicAreaEl.id = "magicAreaEl";
  document.body.appendChild(magicAreaEl);

  if (!this.constructor.instance) {
    this.constructor.instance = new Vue({
      el: "#magicAreaEl",
      components: {
        magicArea
      },
      data: {
        magicProps: {
          routeDatas,
          devServerPort,
          ...moreConfigs,
        }
      },
      template: `
      <magic-area 
        v-bind="magicProps"
      />
    `,
      router
    });
  }
}
export default install;
