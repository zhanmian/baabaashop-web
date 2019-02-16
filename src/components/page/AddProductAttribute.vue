<template>
  <product-attribute-detail :is-edit='false'></product-attribute-detail>
</template>

<script>
  import ProductAttributeDetail from './ProductAttributeDetail'
  export default {
    name: 'addProductAttribute',
    components: { ProductAttributeDetail }
  }
</script>

<style scoped>

</style>
