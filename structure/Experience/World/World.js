import Experience from "../Experience";
import Fox from "./Fox";
import Floor from "./Floor";
import Environment from "./Environment";
import * as THREE from "three";
import Flag from "./Flag/Flag";
import Test from "./Patterns/Test";
import Sea from "./Sea/Sea";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      //this.floor = new Floor();
      //this.fox = new Fox();
      //this.flag = new Flag();
      //this.test = new Test();
      //shader below
      this.sea = new Sea();
      this.environment = new Environment();
    });
  }

  update() {
    if (this.fox) {
      this.fox.update();
    }

    if (this.flag) {
      this.flag.update();
    }

    if (this.sea) {
      this.sea.update();
    }
  }
}
