<template>
  <product-attribute-detail :is-edit='true'></product-attribute-detail>
</template>

<script>
  import ProductAttributeDetail from './ProductAttributeDetail'
  export default {
    name: 'updateProductAttr',
    components: { ProductAttributeDetail }
  }
</script>

<style scoped>

</style>
