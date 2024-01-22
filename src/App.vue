<script setup lang="ts">
import { ref, onMounted } from "vue";
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import ListView from "./dialogs/list/ListView.vue";
import ImageView from "./dialogs/image/ImageView.vue";
import InfoView from "./dialogs/info/InfoView.vue";
import WizardView from "./dialogs/wizard/WizardView.vue";

interface RateCard {
  Starter: Costs[];
  Optimal: Costs[];
  Enhanced: Costs[];
}

interface Costs {
  rateDescription: string;
  rateCostAllScreens: number;
  rateCostPerScreen: number;
  isRatePerScreen: boolean;
}

const open = ref(false);
const listOpen = ref(false);
const wizardOpen = ref(false);
const openImage = ref(false);
const map = ref();
const markerGroup = ref();
const locationData = ref<any[]>([]);
const meta = ref();
const activeImage = ref();
const categories = ref<RateCard>({
  Starter: [],
  Optimal: [],
  Enhanced: [],
});

onMounted(async() => {
  map.value = L.map('map').setView([50.9885170505752, -0.1969095226736214], 11);
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

  locationData.value = await fetch("https://admin.bluebillboard.co.uk/api/public/venues").then(res => res.json());
  processLocationData();

  setTimeout(function () {
    window.dispatchEvent(new Event('resize'));
  }, 1000);
});

const processLocationData = () => {
  locationData.value.forEach((location: any) => {
    const icon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div style="background:#0d47a1;" class="marker-pin"></div><img src="img/customcolor_icon_transparent_background.png"  alt="bbLogo"/>`,
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
  calculateRate();
  open.value = true;
}

const showModalTable = (e: any) => {
  meta.value = e;
  calculateRate();
  open.value = true;
}

const showImageModal = (img: string) => {
  activeImage.value = img;
  openImage.value = true;
}

const calculateRate = () => {
  if (meta.value.isRatePerScreen) {
    // Handle per screen rate
    categories.value.Starter = [{
      rateDescription: "8-10 slots per hour",
      rateCostAllScreens: (meta.value.rate * meta.value.screenCount) - 50,
      rateCostPerScreen: meta.value.rate,
      isRatePerScreen: true
    }]

    categories.value.Optimal = [{
      rateDescription: "18-20 slots per hour",
      rateCostAllScreens: ((meta.value.rate * 2) * meta.value.screenCount) - 100,
      rateCostPerScreen: (meta.value.rate * 2),
      isRatePerScreen: true
    }]

    categories.value.Enhanced = [{
      rateDescription: "36-40 slots per hour",
      rateCostAllScreens: ((meta.value.rate * 3) * meta.value.screenCount) - 150,
      rateCostPerScreen: (meta.value.rate * 3),
      isRatePerScreen: true
    }]
  } else {
    categories.value.Starter = [{
      rateDescription: "8-10 slots per hour",
      rateCostAllScreens: 0,
      rateCostPerScreen: meta.value.rate,
      isRatePerScreen: false
    }]

    categories.value.Optimal = [{
      rateDescription: "18-20 slots per hour",
      rateCostAllScreens: 0,
      rateCostPerScreen: meta.value.rate * 2,
      isRatePerScreen: false
    }]

    categories.value.Enhanced = [{
      rateDescription: "36-40 slots per hour",
      rateCostAllScreens: 0,
      rateCostPerScreen: meta.value.rate * 3,
      isRatePerScreen: false
    }]
  }
}

</script>

<template>
  <div class="flex h-screen">
    <list-view
        v-if="locationData && locationData.length > 0"
        :list-open="listOpen" :location-data="locationData"
               @show-image-modal="showImageModal"
               @show-modal-table="showModalTable"
               @close-list="listOpen = false" />

    <info-view :categories="categories" :open="open" :meta="meta" @close-list="open = false" @show-image-modal="showImageModal" />

    <image-view :open-image="openImage" :active-image="activeImage" @close-image-modal="openImage = false" />
    <wizard-view :open-wizard="wizardOpen" :venues="locationData" @close-wizard="wizardOpen = false" />

    <div id="map" >

    </div>
    <button @click="wizardOpen = true" id="quoteButton" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Get Quote</button>
    <button @click="listOpen = true" id="listButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View List</button>
  </div>
</template>

<style scoped>
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
    filter:var(--map-tiles-filter, none);
  }
}
</style>
