<script setup lang="ts">
import {ref, onMounted} from "vue";
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import WizardView from "./dialogs/wizard/WizardView.vue";
import {useVenueList} from "@/composables/useVenueList";
import VenueList from "@/dialogs/listv2/VenueList.vue";

const open = ref(false);
const wizardOpen = ref(false);
const map = ref();
const markerGroup = ref();
const locationData = ref<any[]>([]);
const displayGroups = ref<any[]>([]);
const meta = ref();
const {sidebarVisible, levelColour} = useVenueList();
const isStripped = ref(false);

const levels = ["Blue", "Gold", "Platinum"];

let lat = 50.9885170505752;
let lng = -0.1969095226736214;
let zoomLevel = 10;

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('stripped') === 'true') {
    isStripped.value = true;
  }

  if (urlParams.get('lat') && urlParams.get('lng')) {
    lat = parseFloat(urlParams.get('lat')!);
    lng = parseFloat(urlParams.get('lng')!);
    zoomLevel = 14;
  }

  map.value = L.map('map').setView([lat, lng], zoomLevel);
  markerGroup.value = L.layerGroup().addTo(map.value);

  let mapSource = "https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  //Check for Dark Mode
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    mapSource = "https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png";
  }

  L.tileLayer(mapSource, {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    className: 'map-tiles'
  }).addTo(map.value);

  L.Layer.include({
    getProps: function () {
      const feature = this.feature = this.feature || {}; // Initialize the feature, if missing.
      feature.type = 'Feature';
      feature.properties = feature.properties || {}; // Initialize the properties, if missing.
      return feature.properties;
    }
  });

  let legend = new L.Control({position: 'topleft'});

  legend.onAdd = function () {

    let div = L.DomUtil.create('div', 'info legend'),
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (let i = 0; i < levels.length; i++) {
      div.innerHTML +=
          '<i style="background:' + levelColour(levels[i]) + '"></i> ' +
          levels[i] + ' Collection<br>';
    }

    return div;
  };

  legend.addTo(map.value);

  locationData.value = await fetch("https://admin.bluebillboard.co.uk/api/public/venues").then(res => res.json());
  displayGroups.value = await fetch("https://admin.bluebillboard.co.uk/api/public/groups").then(res => res.json());
  //displayGroups.value = await fetch("http://localhost:5055/api/public/groups").then(res => res.json());
  //locationData.value = await fetch("http://localhost:5055/api/public/venues").then(res => res.json());
  processLocationData();

  setTimeout(function () {
    window.dispatchEvent(new Event('resize'));
  }, 1000);
});

const processLocationData = () => {
  if (!locationData.value) return;
  locationData.value.forEach((location: any) => {
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background:${levelColour(location.level)};" class="marker-pin"></div><img src="img/customcolor_icon_transparent_background.png"  alt="bbLogo"/>`,
      iconSize: [50, 72],
      iconAnchor: [25, 72]
    });
    const coords: any = [location.location.coordinates[1], location.location.coordinates[0]]
    let marker: any = L.marker(coords, {icon: icon}).addTo(markerGroup.value).on('click', (e: any) => showModal(e));
    marker.getProps().meta = location;
  });
};

const showModal = (e: any) => {
  meta.value = e.sourceTarget.getProps().meta;
  open.value = true;
}


const goToLocationOnMap = (location: any) => {
  map.value.setView([location.coordinates[1], location.coordinates[0]], 20);
  sidebarVisible.value = false;
}

</script>

<template>
  <div class="flex h-screen">
    <Dialog v-if="meta" v-model:visible="open" modal
            :style="{ width: '55rem', 'background-color': levelColour(meta.level), 'max-height': '90vh', 'overflow-y': 'auto' }"
            :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <template #header>
        <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
           class="text-3xl dark:text-white">{{ meta.name }}</p>
      </template>
      <span class="font-semibold block mb-5 dark:text-white"
            :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`">Part of our {{ meta.level }} collection</span>
      <div class="flex align-items-center gap-3" v-if="!isStripped">
        <p class="w-6rem dark:text-white"
           :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`">{{ meta.description }}</p>
      </div>

      <div v-if="isStripped">
        <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
           class="dark:text-white">City: {{ meta.city }}</p>
        <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
           class="mt-2 dark:text-white">Type: {{ meta.type }}</p>
        <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
           class="mt-2 dark:text-white">Footfall (Monthly): {{ meta.footfallPerMonth.toLocaleString() }}</p>
        <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
           class="mt-2 dark:text-white">Screens: {{ meta.screenCount }}</p>
      </div>

      <div v-if="!isStripped" class="flex gap-3 mb-3 w-full">
        <Accordion class="w-full">
          <AccordionTab :pt="{
        headerIcon: { style: `color:${meta.level === 'Blue' ? 'white' : ''}` }
      }">
            <template #header>
              <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`">More info</p>
            </template>
            <template #default>
              <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
                 class="dark:text-white">City: {{ meta.city }}</p>
              <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
                 class="mt-2 dark:text-white">Type: {{ meta.type }}</p>
              <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
                 class="mt-2 dark:text-white">Footfall (Monthly): {{ meta.footfallPerMonth.toLocaleString() }}</p>
              <p :class="`${meta.level === 'Blue' ? 'text-white' : 'text-black dark:text-white'}`"
                 class="mt-2 dark:text-white">Screens: {{ meta.screenCount }}</p>

            </template>

          </AccordionTab>
        </Accordion>
      </div>
      <div v-if="!isStripped" class="flex gap-3 mb-5">
        <img class="max-h-3/4 w-full object-cover"
             :src="`${meta.image}`" alt=""/>
      </div>
    </Dialog>

    <wizard-view :open-wizard="wizardOpen" :venues="locationData" :display-groups="displayGroups"
                 @close-wizard="wizardOpen = false"/>
    <venue-list :location-data="locationData" @set-location="goToLocationOnMap"/>
    <div id="map">

    </div>
    <button v-if="!isStripped" @click="wizardOpen = true" id="quoteButton"
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Get Quote
    </button>
    <button v-if="!isStripped" @click="sidebarVisible = true" id="listButton"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View List
    </button>
    <toast/>
  </div>
</template>

<style>
#listButton {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  z-index: 19;
}

#quoteButton {
  position: absolute;
  top: 20px;
  right: 130px;
  padding: 10px;
  z-index: 19;
}

:root {
  --map-tiles-filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
}

@media (prefers-color-scheme: dark) {
  .map-tiles {
    filter: var(--map-tiles-filter, none);
  }
}

.legend {
  line-height: 18px;
  color: #555;
}

.legend i {
  width: 100%;
  height: 18px;
  float: left;
  margin-right: 8px;
  opacity: 0.7;
}

.info {
  padding: 6px 8px;
  font: 14px/16px Arial, Helvetica, sans-serif;
  background: white;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
}

.info h4 {
  margin: 0 0 5px;
  color: #777;
}
</style>
