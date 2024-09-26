<script setup lang="ts">
import {ref, watch} from "vue";
import {FilterMatchMode} from 'primevue/api';
import {useToast} from "primevue/usetoast";

interface SelectedVenues {
  selected: any[];
}

interface Plan {
  name: string;
  description: string;
  price: number;
  feature1: string;
  features: string[];
}
const toast = useToast();
const isCharity = ref<boolean>(false);
const isPartner = ref<boolean>(false);
const isChamber = ref<boolean>(false);
const isCircle = ref<boolean>(false);
const saveQuote = ref<boolean>(false);
const emailAddress = ref<string>("");
const isSavingQuote = ref<boolean>(false);
const emailSearch = ref<string>("");
const openSavedSearch = ref<boolean>(false);
const savedQuotes = ref<any[]>([]);
const loadQuote = ref<any>();
const name = ref<string>("");
const displayGroup = ref<string>("");
const totalRate = ref(0);
const op = ref();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  id: { value: null, matchMode: FilterMatchMode.IN },
});

const props = defineProps({
  openWizard: {
    type: Boolean,
    required: true
  },
  venues: {
    type: Array<any>,
    required: true
  },
  displayGroups: {
    type: Array<any>,
    required: true
  }
});

const active = ref<number>(0);
const duration = ref<number>(1);
const items = ref([
  {
    label: 'Choose Venues'
  },
  {
    label: 'Additional Information'
  },
  {
    label: 'Quote'
  }
]);

const chambers = ["Worthing & Adur Chamber of Commerce", "Sussex Chamber of Commerce", "Brighton Chamber of Commerce", "Worthing Business Circle", "HHBA", "Horsham & Billingshurst Chamber of Commerce", "Independent Worthing"];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const selectedVenues = ref<SelectedVenues>();

const emit = defineEmits({
  'close-wizard': null
});

const isVenueInSelected = (venueId: string) => {
  if (!selectedVenues.value) return false;
  return selectedVenues.value?.selected.find((v: any) => v.id === venueId);
}

const addVenue = (venue: any) => {
  selectVenue(venue);
}

const selectVenue = (venue: any) => {
  if (selectedVenues.value) {
    const index = selectedVenues.value?.selected.findIndex((x: any) => x.id === venue.id);
    if (index > -1) {
      selectedVenues.value?.selected.splice(index, 1);
    } else {
      selectedVenues.value?.selected.push(venue);
    }
  } else {
    selectedVenues.value = {
      selected: [venue]
    }
  }
}

const plans = ref<Plan[]>([
  {
    name: "Starter",
    description: "Gets you on screen for the lowest price",
    price: 0,
    feature1: "8-10 plays/screen/hour",
    features: []
  },
  {
    name: "Optimal",
    description: "For businesses that want more exposure",
    price: 0,
    feature1: "18-20 plays/screen/hour",
    features: []
  },
  {
    name: "Enhanced",
    description: "For businesses that want maximum exposure",
    price: 0,
    feature1: "36-40 plays/screen/hour",
    features: []
  },
]);

const resetCalculations = () => {
  plans.value[0].features = [];
  plans.value[1].features = [];
  plans.value[2].features = [];

  plans.value[0].price = 0;
  plans.value[1].price = 0;
  plans.value[2].price = 0;
  totalRate.value = 0;
}

const calculateQuote = () => {
  resetCalculations();
  let totalDiscount = 0;
  let totalImpressionsPerMonth = 0;
  let totalImpressionsPerFortnight = 0;
  selectedVenues.value?.selected.forEach((venue: any) => {
    if (venue.isRatePerScreen) {
      totalRate.value += venue.rate * venue.screenCount - 50;
    } else {
      totalRate.value += venue.rate;
    }
    // Sum impressions
    totalImpressionsPerMonth += venue.impressionsPerMonth;
    totalImpressionsPerFortnight += venue.impressionsPerFortnight;
  });

  // Apply Discounts
  // Apply Charity
  if (isCharity.value) {
    totalDiscount = totalDiscount + 0.25;
    plans.value[0].features.push("Includes Charity discount of 25%");
    plans.value[1].features.push("Includes Charity discount of 25%");
    plans.value[2].features.push("Includes Charity discount of 25%");
  }
  // Apply Partner
  if (isPartner.value) {
    totalDiscount = totalDiscount + 0.25;
    plans.value[0].features.push("Includes Partner discount of 25%");
    plans.value[1].features.push("Includes Partner discount of 25%");
    plans.value[2].features.push("Includes Partner discount of 25%");
  }
  // Apply Chamber
  if (isChamber.value) {
    totalDiscount = totalDiscount + 0.25;
    plans.value[0].features.push("Includes Chamber discount of 25%");
    plans.value[1].features.push("Includes Chamber discount of 25%");
    plans.value[2].features.push("Includes Chamber discount of 25%");
  }
  // Apply Circle
  if (isCircle.value) {
    totalDiscount = totalDiscount + 0.25;
    plans.value[0].features.push("Includes WBC discount of 25%");
    plans.value[1].features.push("Includes WBC discount of 25%");
    plans.value[2].features.push("Includes WBC discount of 25%");
  }
  // Apply MultiSite
  if (selectedVenues.value && selectedVenues.value?.selected.length >= 2) {
    totalDiscount = totalDiscount + 0.10;
    plans.value[0].features.push("Includes Multi Site discount of 10%");
    plans.value[1].features.push("Includes Multi Site discount of 10%");
    plans.value[2].features.push("Includes Multi Site discount of 10%");
  }
  // Apply MultiMonth
  if (duration.value >= 3) {
    totalDiscount = totalDiscount + 0.10;
    plans.value[0].features.push("Includes Multi Month discount of 10%");
    plans.value[1].features.push("Includes Multi Month discount of 10%");
    plans.value[2].features.push("Includes Multi Month discount of 10%");
  }
  // Apply Impressions
  plans.value[0].features.push(`Total Impressions Per Month: ${(2.5 / 100) * totalImpressionsPerMonth}`);
  plans.value[1].features.push(`Total Impressions Per Month: ${(5 / 100) * totalImpressionsPerMonth}`);
  plans.value[2].features.push(`Total Impressions Per Month: ${(10 / 100) * totalImpressionsPerMonth}`);

  plans.value[0].features.push(`Total Impressions Per Fortnight: ${(2.5 / 100) * totalImpressionsPerFortnight}`);
  plans.value[1].features.push(`Total Impressions Per Fortnight: ${(5 / 100) * totalImpressionsPerFortnight}`);
  plans.value[2].features.push(`Total Impressions Per Fortnight: ${(10 / 100) * totalImpressionsPerFortnight}`);

  applyDiscount(totalDiscount);
  plans.value[0].price = totalRate.value;
  plans.value[1].price = totalRate.value * 1.8;
  plans.value[2].price = totalRate.value * 3.5;
};

const applyDiscount = (discount: number) => {
  totalRate.value = totalRate.value - (totalRate.value * discount);
};

const searchForSavedQuotes = async () => {
  try {
    isSavingQuote.value = true;
    if (emailSearch.value === "") {
      toast.add({severity: 'error', summary: 'Error', detail: 'Please enter your email address.', life: 3000});
      return;
    }

    savedQuotes.value = await fetch(`https://admin.bluebillboard.co.uk/api/public/quotes?q=${emailSearch.value}`).then(res => res.json());
  } catch (e: any) {
    toast.add({severity: 'error', summary: 'Error', detail: e.message, life: 3000});
  } finally {
    isSavingQuote.value = false;
  }
}

const saveNewQuote = async () => {
  if (emailAddress.value === "") {
    toast.add({severity: 'error', summary: 'Error', detail: 'Please enter your email address.', life: 3000});
    return;
  }
  if (selectedVenues.value?.selected.length === 0) {
    toast.add({severity: 'error', summary: 'Error', detail: 'Please select at least one venue.', life: 3000});
    return;
  }
  if (name.value === "") {
    toast.add({severity: 'error', summary: 'Error', detail: 'Please enter your name.', life: 3000});
    return;
  }

  try {
    isSavingQuote.value = true;
    const quote = {
      name: name.value,
      email: emailAddress.value,
      venues: selectedVenues.value?.selected,
      isCharity: isCharity.value,
      isPartner: isPartner.value,
      isChamber: isChamber.value,
      duration: duration.value,
      date: new Date()
    };

    await createQuote(quote);
    closeWizard();
    toast.add({severity: 'success', summary: 'Quote Saved', detail: 'Your quote has been saved successfully.', life: 3000});
  } catch (e: any) {
    toast.add({severity: 'error', summary: 'Error', detail: e.message, life: 3000});
  } finally {
    isSavingQuote.value = false;
  }

}

const toggle = (event: any) => {
  op.value.toggle(event);
}

const createQuote = async (quote: any) => {
  await fetch(`https://admin.bluebillboard.co.uk/api/public/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(quote)
  });
}


const closeWizard = () => {
  saveQuote.value = false;
  totalRate.value = 0;
  selectedVenues.value = undefined;
  active.value = 0;
  filters.value.global.value = null;
  resetCalculations();
  emit('close-wizard');
};

watch(loadQuote, (newValue) => {
  if (newValue) {
    const val = JSON.parse(JSON.stringify(newValue));
    selectedVenues.value = {
      selected: val.venues
    }
    isCharity.value = val.isCharity;
    isPartner.value = val.isPartner;
    isChamber.value = val.isChamber;
    duration.value = val.duration;
    calculateQuote();
    active.value = 2;
    openSavedSearch.value = false;
  }
});

watch(active, (newValue) => {
  if (newValue === 2) {
    calculateQuote();
  }
});

watch(displayGroup, (newValue) => {
  if (newValue) {
    filters.value['id'].value = props.displayGroups.find((d: any) => d.id === newValue).venueIds;
  } else {
    filters.value['id'].value = null;
  }
});
</script>

<template>
  <Dialog v-model:visible="props.openWizard" modal header="Quote Wizard" :style="{ width: '70rem', 'background-color': 'white' }"
          style="max-height: 90vh; overflow-y: auto;" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }" :closable="false">
    <div>
      <Steps v-model:activeStep="active" :model="items" :readonly="false" class="cursor-pointer" />
      <Card v-if="active === 0">
        <template #title>
          <div class="flex justify-between items-center">
            <span>Choose Venues</span>
            <Button icon="pi pi-eye" @click="openSavedSearch = true" label="Load saved quotes" />
          </div>
        </template>
        <template #content>
          <DataTable :value="venues"
                     tableStyle="min-width: 50rem"
                     v-model:filters="filters"
                     filterDisplay="row"
                     :globalFilterFields="['name', 'city', 'type']"
          >
            <template #header>
              <div class="flex w-full">
                    <span class="p-input-icon-left w-full">
                        <i class="pi pi-search" />
                        <InputText class="ml-2 w-2/4" v-model="filters['global'].value" placeholder="Search (Name, Type or Location)" />
                        <Dropdown showClear v-model="displayGroup" :options="props.displayGroups" class="w-2/4 ml-2" option-label="name" option-value="id" placeholder="Or select a group" />
                    </span>
              </div>
            </template>
            <Column header="Image">
              <template #body="slotProps">
                <img :src="`${slotProps.data.image}`" :alt="slotProps.data.image"
                     class="w-20 shadow-2 border-round object-contain"/>
              </template>
            </Column>

            <Column field="name" header="Name"></Column>
            <Column field="level" header="Collection"></Column>
            <Column field="type" header="Type"></Column>
            <Column field="city" header="City"></Column>

            <Column header="Action">
              <template #body="slotProps">
                <Button v-if="!isVenueInSelected(slotProps.data.id)" icon="pi pi-plus"
                        class="bg-blue-500 border-blue-500"
                        @click="addVenue(slotProps.data)"/>
                <Button v-if="isVenueInSelected(slotProps.data.id)" icon="pi pi-minus"
                        class="bg-red-500 border-red-500 p-button-rounded p-button-text hover:bg-red-600 hover:border-red-600"
                        @click="addVenue(slotProps.data)"/>
              </template>
            </Column>
          </DataTable>

        </template>
        <template #footer>
          <Button icon="pi pi-angle-right" @click="active = 1" label="Next"/>
        </template>
      </Card>
      <Card v-if="active === 1">
        <template #title> Additional information</template>
        <template #content>
          <div class="flex items-center">
            <Checkbox v-model="isCharity" name="isCharity" :binary="true" :disabled="isPartner || isChamber"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isCharity">Are you a registered charity?</label>
          </div>
          <div class="flex items-center mt-2">
            <Checkbox v-model="isPartner" name="isPartner" :binary="true" :disabled="isChamber || isCharity"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isPartner">Do you have a Blue Billboard screen?</label>
          </div>
          <div class="flex items-center mt-2">
            <Checkbox v-model="isChamber" name="isChamber" :binary="true" :disabled="isCharity || isPartner"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isChamber">Are you a member of an approved Chamber of Commerce (See list)?</label>
            <Avatar @click="toggle" icon="pi pi-info-circle" style="background-color: #0d47a1; color: #ffffff" shape="circle" class="ml-3" />
            <OverlayPanel appendTo="body" ref="op" class="surface-card shadow-2 border-round">
              <Card>
                <template #title> Approved Chambers & Group Discounts </template>
                <template #content>
                  <p v-for="(chamber, cIdx) in chambers" :key="cIdx">{{chamber}}</p>
                </template>
              </Card>
            </OverlayPanel>
          </div>
          <div class="flex items-center mt-2">
            <Dropdown v-model="duration" :options="months" placeholder="How Long is the campaign?"
                      class="w-full">
            </Dropdown>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight ml-2"
                   for="isMultiMonth">Select the duration of your campaign.</label>
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-angle-left" class="mr-2" @click="active = 0" label="Back"/>
          <Button icon="pi pi-angle-right" @click="calculateQuote(); active = 2" label="Next"/>
        </template>
      </Card>

      <Card v-if="active === 2">
        <template #title> Quote</template>
        <template #content>
          <div class="grid sm:grid-cols-1 lg:grid-cols-3 mt-10">
            <div v-for="(plan, index) in plans" :key="index" class="mx-3">
              <Card>
                <template #title> {{plan.name}}</template>
                <template #content>
                  <p class="text-gray-600 mb-4 dark:text-white">{{ plan.description }}</p>
                  <div class="flex items-center justify-center mb-4">
                    <span class="text-4xl font-semibold">£{{ plan.price.toFixed(2) }}</span>
                    <span class="text-gray-600 ml-2 dark:text-white">/month + VAT</span>
                  </div>
                  <ul class="text-gray-600 dark:text-white">
                    <li class="mb-2">{{ plan.feature1 }}</li>
                    <li v-for="(f, i) in plan.features" class="mb-2" :key="i">{{ f }}</li>
                  </ul>
                </template>
              </Card>
            </div>
          </div>
          <div class="flex items-center mt-2">
            <Checkbox v-model="saveQuote" name="saveQuote" :binary="true"></Checkbox>
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate text-xl sm:tracking-tight ml-2"
                   for="saveQuote">Tick to save this quote</label>
          </div>
          <div class="mt-4 block" v-if="saveQuote">
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate text-xl sm:tracking-tight block"
                   for="emailAddress">Email Address (So you can load your quote later)</label>
            <InputText v-model="emailAddress" placeholder="Enter your email address" id="emailAddress" class="w-3/4 mt-2 block" />
            <label class="leading-7 text-gray-900 dark:text-white sm:truncate text-xl sm:tracking-tight block"
                   for="emailAddress">Name</label>
            <InputText v-model="name" placeholder="Enter your name" id="name" class="w-3/4 mt-2 block" />
            <Button :loading="isSavingQuote" icon="pi pi-save" severity="success" @click="saveNewQuote" label="Save" class="mt-4" />
          </div>
        </template>
        <template #footer>
          <Button icon="pi pi-angle-left" @click="active = 1" label="Back"/>
        </template>
      </Card>

    </div>

    <template #footer>
      <Button label="Done" icon="pi pi-times" @click="closeWizard" text/>
    </template>
  </Dialog>

  <Dialog v-model:visible="openSavedSearch" modal header="Load your saved quote" :style="{ width: '30rem', 'background-color': 'white' }"
          style="max-height: 40vh; overflow-y: auto;" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div>
      <label class="leading-7 text-gray-900 dark:text-white sm:truncate text-xl sm:tracking-tight block"
             for="emailAddress">Email Address</label>
      <InputText v-model="emailSearch" placeholder="Enter your email address" id="emailAddress" class="w-3/4 mt-2 block" />
      <Button :loading="isSavingQuote" icon="pi pi-search" severity="success" @click="searchForSavedQuotes" label="Search" class="mt-4" />
      <div v-if="savedQuotes.length > 0" class="mt-4">
        <Dropdown v-model="loadQuote" :options="savedQuotes" placeholder="Select quote" optionLabel="date"
                  class="w-full">
          <template #option="slotProps">
            <div class="flex align-items-center">
              <div>{{ new Date(slotProps.option.date).toLocaleDateString('en-gb') }}</div>
            </div>
          </template>
          <template #value="slotProps">
            <div class="flex align-items-center" v-if="slotProps.value">
              {{new Date(slotProps.value.date).toLocaleDateString('en-gb')}}
            </div>
          </template>
        </Dropdown>
        <label class="leading-7 text-gray-900 dark:text-white sm:truncate sm:tracking-tight ml-2"
               for="isMultiMonth">Select your saved quote</label>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>
.custom-dialog-width {
  width: 700px; /* Adjust the width to your desired value */
}
</style>