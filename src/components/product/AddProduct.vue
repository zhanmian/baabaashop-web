<template>
  <product-detail :is-edit='false'></product-detail>
</template>

<script>
  import ProductDetail from './ProductDetail'
  export default {
    name: 'addProduct',
    components: { ProductDetail }
  }
</script>

<style scoped>

</style>
