import magicArea from "./magic-area.vue";

function install(Vue, router, routeDatas, devServerPort) {
  const magicAreaEl = document.createElement("div");
  magicAreaEl.id = "magicAreaEl";
  document.body.appendChild(magicAreaEl);

  new Vue({
    el: "#magicAreaEl",
    components: {
      magicArea
    },
    data: {
      routeDatas,
      devServerPort
    },
    template: `
      <magic-area 
        :route-datas="routeDatas"
        :dev-server-port="devServerPort"
      />
    `,
    router
  });
}

export default install;
