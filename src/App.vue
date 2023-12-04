<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const open = ref(false);
const listOpen = ref(false);
const openImage = ref(false);
const map = ref();
const markerGroup = ref();
const locationData = ref<any[]>([]);
const meta = ref();
const activeImage = ref();

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

onMounted(async() => {
  map.value = L.map('map').setView([50.9885170505752, -0.1969095226736214], 11);
  markerGroup.value = L.layerGroup().addTo(map.value);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
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

const categories = ref<RateCard>({
  Starter: [],
  Optimal: [],
  Enhanced: [],
})

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
    <TransitionRoot as="template" :show="listOpen">
      <Dialog as="div" class="relative z-20">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-3xl">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="bg-[#0d47a1] py-6 px-4 sm:px-6">
                      <div class="flex items-center justify-between">
                        <DialogTitle class="text-lg font-medium text-white">All Locations</DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button" class="rounded-md bg-[#0d47a1] text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white" @click="listOpen = false">
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <table class="table-fixed border-collapse border border-slate-400 m-2 ml-2">
                      <thead>
                      <tr>
                        <th class="border border-slate-300 p-2">Image</th>
                        <th class="border border-slate-300 p-2">Name</th>
                        <th class="border border-slate-300 p-2">Details</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="(l, index) in locationData" :key="index">
                        <td class="border border-slate-300 p-2"><img @click="showImageModal(`https://admin.bluebillboard.co.uk/images/locations/${l.image}`)" class="h-28 w-28 object-cover cursor-pointer" :src="`https://admin.bluebillboard.co.uk/images/locations/${l.image}`" alt="" /></td>
                        <td class="border border-slate-300 p-2">{{l.name}}</td>
                        <td class="border border-slate-300 p-2">
                          <a class="cursor-pointer text-blue-500" @click="showModalTable(l)">View</a>
                        </td>
                      </tr>
                      </tbody>
                    </table>
                  </div>

                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>


    <TransitionRoot as="template" :show="open">
      <Dialog as="div" class="relative z-20">
        <div class="fixed inset-0" />

        <div class="fixed inset-0 overflow-hidden">
          <div class="absolute inset-0 overflow-hidden">
            <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <TransitionChild as="template" enter="transform transition ease-in-out duration-500 sm:duration-700" enter-from="translate-x-full" enter-to="translate-x-0" leave="transform transition ease-in-out duration-500 sm:duration-700" leave-from="translate-x-0" leave-to="translate-x-full">
                <DialogPanel class="pointer-events-auto w-screen max-w-3xl">
                  <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div class="bg-[#0d47a1] py-6 px-4 sm:px-6">
                      <div class="flex items-center justify-between">
                        <DialogTitle class="text-lg font-medium text-white">{{meta.name}}</DialogTitle>
                        <div class="ml-3 flex h-7 items-center">
                          <button type="button" class="rounded-md bg-[#0d47a1] text-white hover:text-white focus:outline-none focus:ring-2 focus:ring-white" @click="open = false">
                            <span class="sr-only">Close panel</span>
                            <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div class="mt-1">
                        <p class="text-sm text-blue-300">
                          {{meta.description}}
                        </p>
                      </div>
                    </div>
                    <div class="relative h-60">
                      <img @click="showImageModal(`https://admin.bluebillboard.co.uk/images/locations/${meta.image}`)" class="absolute h-full w-full object-cover cursor-pointer" :src="`https://admin.bluebillboard.co.uk/images/locations/${meta.image}`" alt="" />
                    </div>
                    <div class="relative flex-1 py-6 px-4 sm:px-6 w-full">
                      <!-- Replace with your content -->
                      <div class="absolute inset-0 py-6 px-4 sm:px-6">
                        <div class="h-full w-full" aria-hidden="true">
                          <p class="text-black-300 text-3xl">Footfall/Month: {{meta.footfallPerMonth.toLocaleString()}}</p>
                          <p class="text-black-300 text-3xl mt-2">Total Screens: {{meta.screenCount}}</p>
                          <p class="text-black-300 text-2xl mt-10">Rate Card</p>
                          <div class="w-full mt-2">
                            <TabGroup>
                              <TabList class="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                                <Tab
                                    v-for="category in Object.keys(categories)"
                                    as="template"
                                    :key="category"
                                    v-slot="{ selected }"
                                >
                                  <button
                                      :class="[
              'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
              'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
              selected
                ? 'bg-[#0d47a1] text-white shadow'
                : 'text-blue-400 hover:bg-white/[0.12] hover:text-[#0d47a1]',
            ]"
                                  >
                                    {{ category }}
                                  </button>
                                </Tab>
                              </TabList>

                              <TabPanels class="mt-2">
                                <TabPanel
                                    v-for="(posts, idx) in Object.values(categories)"
                                    :key="idx"
                                    :class="[
            'rounded-xl bg-white p-3',
            'ring-white/60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
          ]"
                                >
                                  <ul>
                                    <li
                                        v-for="(post, i) in posts"
                                        :key="i"
                                        class="relative rounded-md p-3 hover:bg-gray-100"
                                    >
                                      <h3 class="text-xl font-medium leading-5">
                                        Frequency: {{ post.rateDescription }}
                                      </h3>
                                      <ul
                                          v-if="post.isRatePerScreen"
                                          class="mt-2 flex space-x-1 text-lg font-normal leading-4 text-gray-500"
                                      >
                                        <li>£{{ post.rateCostAllScreens }}</li>
                                        <li>-</li>
                                        <li>includes all {{meta.screenCount}} screens,</li>
                                        <li>per month</li>
                                        <li>+ VAT</li>
                                      </ul>

                                      <ul
                                          v-if="post.isRatePerScreen"
                                          class="mt-2 flex space-x-1 text-lg font-normal leading-4 text-gray-500"
                                      >
                                        <li>£{{ post.rateCostPerScreen }}</li>
                                        <li>-</li>
                                        <li>per screen,</li>
                                        <li>per month</li>
                                        <li>+ VAT</li>
                                      </ul>

                                      <ul
                                          v-if="!post.isRatePerScreen"
                                          class="mt-2 flex space-x-1 text-lg font-normal leading-4 text-gray-500"
                                      >
                                        <li>£{{ post.rateCostPerScreen }}</li>
                                        <li>-</li>
                                        <li>per month</li>
                                        <li>+ VAT</li>
                                      </ul>
                                    </li>
                                  </ul>
                                </TabPanel>
                              </TabPanels>
                            </TabGroup>
                          </div>
                        </div>
                      </div>
                      <!-- /End replace -->
                    </div>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot as="template" :show="openImage">
      <Dialog as="div" class="relative z-30" @close="openImage = false">
        <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                  <button type="button" class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" @click="openImage = false">
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div class="sm:flex sm:items-start">
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div class="mt-2">
                      <img :src="activeImage" />
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <div id="map">

    </div>
    <button @click="listOpen = true" id="refreshButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View List</button>
  </div>
</template>

<style scoped>
#refreshButton {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 10px;
  z-index: 19;
}
</style>
