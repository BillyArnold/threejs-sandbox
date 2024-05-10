import Experience from "../Experience";
import Floor from "./Floor";
import Environment from "./Environment";
import * as THREE from "three";

export default class World {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;

    this.resources.on("ready", () => {
      this.floor = new Floor();
      this.environment = new Environment();
    });
  }
}
