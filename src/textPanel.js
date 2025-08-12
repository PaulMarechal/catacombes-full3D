import * as THREE from 'three';

import ThreeMeshUI from 'three-mesh-ui';
import VRControl from 'three-mesh-ui/examples/utils/VRControl.js';          // si utilisé ailleurs
import ShadowedLight from 'three-mesh-ui/examples/utils/ShadowedLight.js';  // si utilisé ailleurs

import FontJSON from 'three-mesh-ui/examples/assets/Roboto-msdf.json';
import FontImage from 'three-mesh-ui/examples/assets/Roboto-msdf.png';
// import SnakeImage from "three-mesh-ui/examples/assets/spiny_bush_viper.jpg";
import * as dat from 'lil-gui';
import * as NameRooms from "./roomInfo.js";

export function TextPanel(scene, roomNumber) {
  // --- helpers langue ---
  const languageEl = document.getElementById('language_site');
  const getLang = () => ((languageEl?.dataset.lang ?? 'FR').trim().toUpperCase());
  const langIndex = (lang) => (lang === 'EN' ? 9 : 2); // FR=2, EN=9

  // --- util ---
  function remplacerCaracteresSpeciaux(chaine) {
    const m = { 'é':'e','à':'a','è':'e','ù':'u','â':'a','ê':'e','ï':'i','ô':'o','ç':'c' };
    return String(chaine ?? '').replace(/[éàèùâêïôç]/g, (ch) => m[ch]);
  }

  // --- sécurité sur roomInfos ---
  const infos = NameRooms.roomInfos?.[roomNumber] ?? [];
  const safe = (i, fallback='') => (infos[i] ?? fallback);

  // --- container principal ---
  const container = new ThreeMeshUI.Block({
    ref: 'container',
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

  // --- titre ---
  const title = new ThreeMeshUI.Block({
    height: 0.2,
    width: 1.5,
    margin: 0.02,
    borderRadius: 0.05,
    justifyContent: 'center',
    fontSize: 0.09,
  });
  title.add(new ThreeMeshUI.Text({ content: `${safe(1)}` })); // Nom de salle
  container.add(title);

  // --- colonnes ---
  const leftSubBlock = new ThreeMeshUI.Block({
    height: 0.95,
    width: 1.3,
    margin: 0.025,
    padding: 0.025,
    textAlign: 'left',
    justifyContent: 'end',
    backgroundOpacity: 0,
  });

  const rightSubBlock = new ThreeMeshUI.Block({
    margin: -0.025,
    borderRadius: 0.025,
  });

  // --- infos fixes (lieu + profondeur) ---
  const subSubBlock1 = new ThreeMeshUI.Block({
    height: 0.18,
    width: 0.5,
    margin: 0.01,
    padding: 0.02,
    fontSize: 0.025,
    borderRadius: 0.5,
    justifyContent: 'center',
    alignItems: 'end',
    backgroundOpacity: 0,
  }).add(
    new ThreeMeshUI.Text({ content: `${safe(3)}` }), // Lieu
    new ThreeMeshUI.Text({ content: `\n Profondeur : environ ${safe(4)}` })
  );

  // --- bloc texte dépendant de la langue ---
  function createSubSubBlock(language_number) {
    return new ThreeMeshUI.Block({
      name: 'subSubBlock2',
      height: 0.7,
      width: 0.5,
      margin: 0.025,
      padding: 0.02,
      fontSize: 0.037,
      alignItems: 'start',
      textAlign: 'left', // valeurs valides: left/center/right
      backgroundOpacity: 0,
      borderRadius: 0.5,
      bestFit: 'shrink',
    }).add(
      new ThreeMeshUI.Text({
        content: remplacerCaracteresSpeciaux(`${safe(language_number)}`),
      })
    );
  }

  let subSubBlock2 = createSubSubBlock(langIndex(getLang()));

  function updateContentAndLanguage(newLanguageIndex) {
    if (subSubBlock2) {
      rightSubBlock.remove(subSubBlock2);
    }
    subSubBlock2 = createSubSubBlock(newLanguageIndex);
    rightSubBlock.add(subSubBlock2);
  }

  // --- assemblage ---
  rightSubBlock.add(subSubBlock2, subSubBlock1);

  // positions (pas besoin de DOMContentLoaded ici)
  title.position.set(-0.3, 0.57, 0.3);
  rightSubBlock.position.set(1, 0, 0.5);

  const contentContainer = new ThreeMeshUI.Block({
    contentDirection: 'row',
    padding: 0.02,
    margin: 0.05,
    backgroundOpacity: 0,
  });

  contentContainer.add(leftSubBlock, rightSubBlock);
  container.name = 'boxContainer';
  container.add(contentContainer);

  // --- synchronisation langue ---
  // 1) init
  updateContentAndLanguage(langIndex(getLang()));

  // 2) écoute l’évènement global émis par ton script principal
  window.addEventListener('languagechange', (e) => {
    const newLang = (e.detail?.lang || getLang()).toUpperCase();
    updateContentAndLanguage(langIndex(newLang));
  });

  // (optionnel) retourner le container pour manipulations ultérieures
  return container;
}