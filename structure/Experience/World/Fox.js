import Experience from "../Experience";
import * as THREE from "three";

export default class Fox {
  constructor() {
    this.experience = new Experience();
    this.scene = this.experience.scene;
    this.resources = this.experience.resources;
    this.time = this.experience.time;
    this.debug = this.experience.debug;

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fox");
    }

    this.resource = this.resources.items.foxModel;

    this.setModel();
    this.setAnimation();
  }

  setModel() {
    this.model = this.resource.scene;
    this.model.scale.set(0.025, 0.025, 0.025);
    this.scene.add(this.model);

    this.model.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
      }
    });
  }

  setAnimation() {
    this.animation = {};
    this.animation.mixer = new THREE.AnimationMixer(this.model);
    this.animation.actions = {
      idle: this.animation.mixer.clipAction(this.resource.animations[0]),
      walk: this.animation.mixer.clipAction(this.resource.animations[1]),
      run: this.animation.mixer.clipAction(this.resource.animations[2]),
    };

    this.animation.actions.current = this.animation.actions.idle;
    this.animation.actions.current.play();

    this.animation.play = (name) => {
      const newAction = this.animation.actions[name];
      const oldAction = this.animation.actions.current;

      newAction.reset();
      newAction.play();
      newAction.crossFadeFrom(oldAction, 1);

      this.animation.actions.current = newAction;
    };

    //Debug
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => {
          this.animation.play("idle");
        },
        playWalk: () => {
          this.animation.play("walk");
        },
        playRun: () => {
          this.animation.play("run");
        },
      };
      for (const key in debugObject) {
        this.debugFolder.add(debugObject, key);
      }
    }
  }

  update() {
    this.animation.mixer.update(this.experience.time.delta * 0.001);
  }
}
