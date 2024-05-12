import Experience from "../Experience";
import Fox from "./Fox";
import Floor from "./Floor";
import Environment from "./Environment";
import * as THREE from "three";
import Flag from "./Flag/Flag";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      //this.floor = new Floor();
      //this.fox = new Fox();
      this.flag = new Flag();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }
  }
}
