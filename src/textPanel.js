import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import VRControl from 'three-mesh-ui/examples/utils/VRControl.js';
import ShadowedLight from 'three-mesh-ui/examples/utils/ShadowedLight.js';

import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';
// import SnakeImage from "three-mesh-ui/examples/assets/spiny_bush_viper.jpg";
import * as dat from 'lil-gui'
import * as NameRooms from "./roomInfo.js";

export function TextPanel(scene, roomNumber) {

    //Debug
    // const gui = new dat.GUI({
    //     width: 300
    // })

    const container = new ThreeMeshUI.Block({
      ref: "container",
      padding: 0.025,
      fontFamily: FontJSON,
      fontTexture: FontImage,
      fontColor: new THREE.Color(0xffffff),
      backgroundOpacity: 0,
      width: 3,
    });
  
    container.position.set(-2.4, 1.6, -1.26);
    container.rotation.y = -1.86;
    scene.add(container);

    // const containerFolder = gui.addFolder('Container')
    // containerFolder.add(container.position, 'x', -30, 30)
    // containerFolder.add(container.position, 'y', -30, 30)
    // containerFolder.add(container.position, 'z', -30, 30)
    // containerFolder.add(container.rotation, 'x', -30, 30)
    // containerFolder.add(container.rotation, 'y', -30, 30)
    // containerFolder.add(container.rotation, 'z', -30, 30)
  
    const title = new ThreeMeshUI.Block({
      height: 0.2,
      width: 1.5,
      margin: 0.02,
      borderRadius: 0.05,
      justifyContent: "center",
      fontSize: 0.09,
    });
  
    // Main Title
    title.add(
      new ThreeMeshUI.Text({
        content: `${NameRooms.roomInfos[roomNumber][1]}`,
      })
    );
    
    container.add(title);
    
  
    const leftSubBlock = new ThreeMeshUI.Block({
        height: 0.95,
        width: 1.3,
        margin: 0.025,
        padding: 0.025,
        textAlign: "left",
        justifyContent: "end",
        backgroundOpacity: 0,
    });
  
    const rightSubBlock = new ThreeMeshUI.Block({
      margin: -0.025,
      borderRadius: 0.025,
    });
  
    const subSubBlock1 = new ThreeMeshUI.Block({
      height: 0.18,
      width: 0.5,
      margin: 0.01,
      padding: 0.02,
      fontSize: 0.025,
      borderRadius: 0.5,
      justifyContent: "center",
      alignItems: "end",
      backgroundOpacity: 0,
    }).add(
      new ThreeMeshUI.Text({
        // Location
        content: `${NameRooms.roomInfos[roomNumber][3]}`,
      }),

      // Depth
      new ThreeMeshUI.Text({
        content: `\n Profondeur : environ ${NameRooms.roomInfos[roomNumber][4]} `,
      })
    );

    let subSubBlock2; 

    const language_site = document.querySelector("#language_site");
    if(language_site.innerText === "FR"){
      subSubBlock2 = createSubSubBlock(2);
    } else if ( language_site.innerText === "EN"){
      subSubBlock2 = createSubSubBlock(9);
    }


    function clickHandler() {
      if (language_site.innerText === "FR") {
          updateContentAndLanguage(9);
          language_site.innerText = "EN";
      } else if (language_site.innerText === "EN") {
          updateContentAndLanguage(2);
          language_site.innerText = "FR";
      }
      // language_site.removeEventListener("click", clickHandler);
  }
  
  language_site.addEventListener("click", clickHandler);

    function createSubSubBlock(language_number) {
      return new ThreeMeshUI.Block({
        name: 'subSubBlock2',
        height: 0.7,
        width: 0.5,
        margin: 0.025,
        padding: 0.02,
        fontSize: 0.037,
        alignItems: "start",
        textAlign: 'justify-left',
        backgroundOpacity: 0,
        borderRadius: 0.5,
        bestFit: 'shrink',
      }).add(
        new ThreeMeshUI.Text({
          content: remplacerCaracteresSpeciaux(`${NameRooms.roomInfos[roomNumber][language_number]}`),
        })
      );
    }

    function updateContentAndLanguage(newLanguage) {

      rightSubBlock.remove(subSubBlock2);

      subSubBlock2 = createSubSubBlock(newLanguage);

      rightSubBlock.add(subSubBlock2)
    }

    
  
    // const subSubBlock2 = new ThreeMeshUI.Block({
    //   height: 0.7,
    //   width: 0.5,
    //   margin: 0.025,
    //   padding: 0.02,
    //   fontSize: 0.037,
    //   alignItems: "start",
    //   textAlign: 'justify-left',
    //   backgroundOpacity: 0,
    //   bestFit: 'shrink',
    // }).add(
    //   new ThreeMeshUI.Text({
    //     content: remplacerCaracteresSpeciaux(`${NameRooms.roomInfos[roomNumber][2]}`),

    //   })
    // );


    function remplacerCaracteresSpeciaux(chaine) {
      const caracteresSpeciaux = {'é': 'e', 'à': 'a', 'è': 'e', 'ù': 'u', 'â': 'a', 'ê': 'e', 'ï': 'i', 'ô': 'o', 'ç': 'c'};
      
      return chaine.replace(/[éàèùâêïôç]/g, function(match) {
        return caracteresSpeciaux[match];
      });
    }

    // No need 
    // console.log("`${NameRooms.roomInfos[roomNumber][2]}`")
    // console.log(NameRooms.roomInfos[roomNumber][2])

  
    rightSubBlock.add(subSubBlock2, subSubBlock1);

    document.addEventListener("DOMContentLoaded", () => {
      title.position.set(-0.3, 0.57, 0.3)
      rightSubBlock.position.set(1, 0, 0.5)
    });

    const contentContainer = new ThreeMeshUI.Block({
      contentDirection: "row",
      padding: 0.02,
      margin: 0.05,
      backgroundOpacity: 0,
    //   justifyContent: "end",
    });
    
  
    contentContainer.add(leftSubBlock, rightSubBlock);
    // contentContainer.add(rightSubBlock);
    container.name = "boxContainer"
    container.add(contentContainer);
  
    //
  
    // new THREE.TextureLoader().load(SnakeImage, (texture) => {
    //   leftSubBlock.set({
    //     backgroundTexture: texture,
    //   });
    // });
}