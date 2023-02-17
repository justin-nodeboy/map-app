<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import { marked } from 'marked';

const open = ref(false);
const openImage = ref(false);
const map = ref();
const markerGroup = ref();
const locationData = ref([]);
const meta = ref();
const activeImage = ref();

const markdownToHtml = computed(() => marked(meta.value.description));

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

  locationData.value = await fetch("https://map.bluebillboard.co.uk/assets/locations.json").then(res => res.json());
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
  console.log(e.sourceTarget.getProps().meta);
  open.value = true;
  meta.value = e.sourceTarget.getProps().meta;
}

const showImageModal = (img: string) => {
  activeImage.value = img;
  openImage.value = true;
}

</script>

<template>
  <div class="flex h-screen">
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
                          {{meta.address.address1}}
                        </p>
                        <p class="text-sm text-blue-300">
                          {{meta.address.address2}}
                        </p>
                        <p class="text-sm text-blue-300">
                          {{meta.address.address3}}
                        </p>
                        <p class="text-sm text-blue-300">
                          {{meta.address.county}}
                        </p>
                        <p class="text-sm text-blue-300">
                          {{meta.address.postcode}}
                        </p>
                      </div>
                    </div>
                    <div class="relative h-60">
                      <img @click="showImageModal(`img/${meta.image}`)" class="absolute h-full w-full object-cover cursor-pointer" :src="`img/${meta.image}`" alt="" />
                    </div>
                    <div class="relative flex-1 py-6 px-4 sm:px-6">
                      <!-- Replace with your content -->
                      <div class="absolute inset-0 py-6 px-4 sm:px-6">
                        <div class="h-full" aria-hidden="true">
                          <p class="text-black-300" v-html="markdownToHtml"></p>
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
    <div id="map"></div>
  </div>
</template>

<style scoped>

</style>
