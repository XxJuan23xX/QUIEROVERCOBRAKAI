// Clase para un nodo del árbol
class TreeNode {
    constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
    }
  }
  
  // Clase para el Árbol Binario
  class BinaryTree {
    constructor() {
      this.root = null;
    }
  }
  
  // Clase para manejar la interfaz de usuario
  class TreeApp {
    constructor() {
      // Elementos del DOM
      this.treeSizeInput = document.getElementById('tree-size');
      this.generateTreeButton = document.getElementById('generate-tree');
      this.treeInputsDiv = document.getElementById('tree-inputs');
      this.outputDiv = document.getElementById('output');
      this.canvas = document.getElementById('treeCanvas');
      this.ctx = this.canvas.getContext('2d');
      this.buildTreeButton = document.getElementById('build-tree');
  
      // Botones de acciones
      this.bfsButton = document.getElementById('bfs');
      this.preorderButton = document.getElementById('preorder');
      this.inorderButton = document.getElementById('inorder');
      this.postorderButton = document.getElementById('postorder');
  
      // Instancia del árbol
      this.tree = new BinaryTree();
  
      // Configurar eventos
      this.setEventListeners();
    }
  
    // Configurar eventos
    setEventListeners() {
      this.generateTreeButton.addEventListener('click', () => this.generateTreeInputs());
      this.buildTreeButton.addEventListener('click', () => {
        const isValid = this.buildTreeFromInputs();
        if (isValid) this.drawTree();
      });
      this.bfsButton.addEventListener('click', () => this.handleTraversal('bfs'));
      this.preorderButton.addEventListener('click', () => this.handleTraversal('preorder'));
      this.inorderButton.addEventListener('click', () => this.handleTraversal('inorder'));
      this.postorderButton.addEventListener('click', () => this.handleTraversal('postorder'));
    }
  
    // Generar campos para los valores del árbol
    generateTreeInputs() {
      const size = parseInt(this.treeSizeInput.value);
      if (isNaN(size) || size <= 0) {
        alert('Por favor, introduce un tamaño válido.');
        return;
      }
  
      this.treeInputsDiv.innerHTML = ''; // Limpiar inputs anteriores
      for (let i = 0; i < size; i++) {
        const container = document.createElement('div');
        container.classList.add('node-input');
  
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = i === 0 ? 'Raíz (obligatoria)' : `Valor Nodo ${i + 1}`;
        input.classList.add('tree-value');
  
        const leftCheckbox = document.createElement('input');
        leftCheckbox.type = 'checkbox';
        leftCheckbox.classList.add('has-left');
        const leftLabel = document.createElement('label');
        leftLabel.textContent = 'Hijo Izq';
  
        const rightCheckbox = document.createElement('input');
        rightCheckbox.type = 'checkbox';
        rightCheckbox.classList.add('has-right');
        const rightLabel = document.createElement('label');
        rightLabel.textContent = 'Hijo Der';
  
        container.appendChild(input);
        container.appendChild(leftCheckbox);
        container.appendChild(leftLabel);
        container.appendChild(rightCheckbox);
        container.appendChild(rightLabel);
        this.treeInputsDiv.appendChild(container);
      }
    }
  
 // Construir el árbol desde los inputs definidos por el usuario
buildTreeFromInputs() {
  const inputs = document.querySelectorAll('.node-input');
  if (inputs.length === 0) {
      alert('Por favor, genera entradas primero.');
      return false;
  }

  // Crear un array de nodos basado en las entradas
  const nodes = [];
  inputs.forEach(input => {
      const value = input.querySelector('.tree-value').value;
      if (!value) {
          nodes.push(null); // Si no hay valor, es un nodo vacío
      } else {
          nodes.push({
              value: value,
              left: input.querySelector('.has-left').checked,
              right: input.querySelector('.has-right').checked
          });
      }
  });

  // Validar que el primer nodo (raíz) exista
  if (!nodes.length || nodes[0] === null) {
      alert('Por favor, define al menos un nodo raíz.');
      return false;
  }

  // Crear la raíz
  const rootValue = nodes[0].value;
  this.tree.root = new TreeNode(rootValue);

  // Usar una cola para construir el árbol dinámicamente
  const queue = [{ node: this.tree.root, data: nodes[0] }];
  let currentIndex = 1; // Índice para los nodos restantes

  while (queue.length > 0) {
      const { node, data } = queue.shift(); // Tomar el nodo actual y su configuración

      // Crear hijo izquierdo solo si la casilla está marcada
      if (data.left) {
          if (currentIndex < nodes.length && nodes[currentIndex]) {
              const leftNodeData = nodes[currentIndex];
              if (!isNaN(node.value) && !isNaN(leftNodeData.value)) {
                  // Validar números: izquierdo debe ser menor que el nodo padre
                  if (parseInt(leftNodeData.value) >= parseInt(node.value)) {
                      alert(`Error: El valor del hijo izquierdo (${leftNodeData.value}) debe ser menor que el nodo padre (${node.value}).`);
                      return false;
                  }
              }
              const leftNode = new TreeNode(leftNodeData.value);
              node.left = leftNode;
              queue.push({ node: leftNode, data: leftNodeData });
          }
          currentIndex++; // Incrementar índice solo si un hijo izquierdo está marcado
      }

      // Crear hijo derecho solo si la casilla está marcada
      if (data.right) {
          if (currentIndex < nodes.length && nodes[currentIndex]) {
              const rightNodeData = nodes[currentIndex];
              if (!isNaN(node.value) && !isNaN(rightNodeData.value)) {
                  // Validar números: derecho debe ser mayor que el nodo padre
                  if (parseInt(rightNodeData.value) <= parseInt(node.value)) {
                      alert(`Error: El valor del hijo derecho (${rightNodeData.value}) debe ser mayor que el nodo padre (${node.value}).`);
                      return false;
                  }
              }
              const rightNode = new TreeNode(rightNodeData.value);
              node.right = rightNode;
              queue.push({ node: rightNode, data: rightNodeData });
          }
          currentIndex++; // Incrementar índice solo si un hijo derecho está marcado
      }
  }

  return true; // Árbol construido exitosamente
}

  
    // Dibujar el árbol en el canvas
    drawTree() {
      if (!this.tree.root) return;
  
      // Limpiar canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      const drawNode = (node, x, y, level, xOffset) => {
        if (!node) return;
  
        const yOffset = 80; // Espacio vertical entre niveles
        const nextLevelXOffset = xOffset / 2; // Reducir el espacio horizontal para el siguiente nivel
  
        // Dibujar líneas a los hijos
        if (node.left) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, y);
          this.ctx.lineTo(x - xOffset, y + yOffset);
          this.ctx.stroke();
        }
  
        if (node.right) {
          this.ctx.beginPath();
          this.ctx.moveTo(x, y);
          this.ctx.lineTo(x + xOffset, y + yOffset);
          this.ctx.stroke();
        }
  
        // Dibujar el nodo actual
        this.ctx.beginPath();
        this.ctx.arc(x, y, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.value, x, y);
  
        // Dibujar nodos hijos recursivamente
        if (node.left) {
          drawNode(node.left, x - xOffset, y + yOffset, level + 1, nextLevelXOffset);
        }
        if (node.right) {
          drawNode(node.right, x + xOffset, y + yOffset, level + 1, nextLevelXOffset);
        }
      };
  
      // Llamar a la función para dibujar comenzando desde la raíz
      const initialXOffset = this.canvas.width / 4; // Ajustar separación inicial
      drawNode(this.tree.root, this.canvas.width / 2, 40, 0, initialXOffset);
    }
  
    // Mostrar resultados de los recorridos
    handleTraversal(type) {
      if (!this.tree.root) {
        alert('Primero construye el árbol.');
        return;
      }
  
      let result = [];
      switch (type) {
        case 'bfs':
          result = this.bfs();
          this.displayOutput(`Amplitud: ${result.join(', ')}`);
          break;
        case 'preorder':
          result = this.preorder(this.tree.root);
          this.displayOutput(`Preorden: ${result.join(', ')}`);
          break;
        case 'inorder':
          result = this.inorder(this.tree.root);
          this.displayOutput(`Inorden: ${result.join(', ')}`);
          break;
        case 'postorder':
          result = this.postorder(this.tree.root);
          this.displayOutput(`Postorden: ${result.join(', ')}`);
          break;
        default:
          this.displayOutput('Tipo de recorrido no válido.');
          break;
      }
    }
  
    bfs() {
      const queue = [this.tree.root];
      const result = [];
      while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.value);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      return result;
    }
  
    preorder(node, result = []) {
      if (!node) return result;
      result.push(node.value);
      this.preorder(node.left, result);
      this.preorder(node.right, result);
      return result;
    }
  
    inorder(node, result = []) {
        if (!node) return result; // Si el nodo es nulo, retornar
      
        // Recorrer el subárbol izquierdo
        this.inorder(node.left, result);
      
        // Procesar el nodo actual (raíz)
        result.push(node.value);
      
        // Recorrer el subárbol derecho
        this.inorder(node.right, result);
      
        return result; // Retornar el resultado acumulado
      }
      
  
    postorder(node, result = []) {
      if (!node) return result;
      this.postorder(node.left, result);
      this.postorder(node.right, result);
      result.push(node.value);
      return result;
    }
  
    displayOutput(message) {
      this.outputDiv.textContent = message;
    }
  }

  document.getElementById('show-nary-tree').addEventListener('click', () => {
    window.location.href = 'naryTree.html'; // Redirige a la página del árbol n-ario
});
  
  // Inicializar la aplicación
  document.addEventListener('DOMContentLoaded', () => {
    new TreeApp();
  });
  