<template>
  <div>
    <v-table>
      <tr class="row" v-for="payment in payments">
        <td>{{ payment._id }}</td>
        <td>{{ objectIdToTimestamp(payment._id) | formatDate }}</td>
        <td>{{ payment.po_amount }}</td>
      </tr>
    </v-table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'PaymentsTable',
  setup() {
    const payments = ref([]);

    onMounted(async () => {
      const res = await axios.get("http://127.0.0.1:49146/server/po_payment");
      payments.value = res.data;
      console.log(res);
    });

    function objectIdToTimestamp(objectId) {
      return new Date(parseInt(objectId.substring(0, 8), 16) * 1000);
    }

    return {
      payments,
      objectIdToTimestamp,
    };
  },
};
</script>
