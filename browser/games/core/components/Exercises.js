resetScene() {
  // Limpiar bloques
  this.scene.blocks.forEach(block => block.destroy());
  this.scene.blocks = [];

  // Limpiar slots
  this.scene.slots.forEach(slot => slot.destroy());
  this.scene.slots = [];
}