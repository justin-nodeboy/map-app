import { createApp } from 'vue'
import './styles/index.css'
import App from './App.vue'
import 'leaflet/dist/leaflet.css';
import PrimeVue from 'primevue/config';
import 'primeicons/primeicons.css'

import Dialog from 'primevue/dialog';
import Steps from 'primevue/steps';
import Card from 'primevue/card';
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import Dropdown from "primevue/dropdown";
import Avatar from "primevue/avatar";
import OverlayPanel from 'primevue/overlaypanel';
import InputText from "primevue/inputtext";
import Sidebar from "primevue/sidebar";
import Toast from 'primevue/toast';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import DataView from 'primevue/dataview';
import TabMenu from 'primevue/tabmenu';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Fieldset from 'primevue/fieldset';

import ToastService from 'primevue/toastservice';
//Design system
import MyDesignSystem from '@/design-system/index.js';

const app = createApp(App);
app.use(PrimeVue, { unstyled: true, pt: MyDesignSystem });

app.component('Dialog', Dialog);
app.component('Steps', Steps);
app.component('Card', Card);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('Checkbox', Checkbox);
app.component('Dropdown', Dropdown);
app.component('Avatar', Avatar);
app.component('OverlayPanel', OverlayPanel);
app.component('InputText', InputText);
app.component('Toast', Toast);
app.component('Sidebar', Sidebar);
app.component('DataView', DataView);
app.component('Accordion', Accordion);
app.component('AccordionTab', AccordionTab);
app.component('TabMenu', TabMenu);
app.component('TabView', TabView);
app.component('TabPanel', TabPanel);
app.component('Fieldset', Fieldset);

app.use(ToastService);

app.mount('#mapApp');
