// Clase para un nodo del árbol n-ario
class NAryTreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
    }
}

// Clase para el Árbol N-ario
class NAryTree {
    constructor() {
        this.root = null;
    }
}

// Clase para manejar el Árbol N-ario predefinido
class NAryTreeApp {
    constructor() {
        this.canvas = document.getElementById('treeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.outputDiv = document.getElementById('output');

        // Crear el árbol n-ario predefinido
        this.nAryTree = this.createNAryTree();

        // Dibujar el árbol y mostrar los recorridos
        this.displayTreeAndTraversals();

        // Botón para volver a la página principal
        document.getElementById('go-back').addEventListener('click', () => {
            window.location.href = 'index.html'; // Redirige de vuelta a la página principal
        });
    }

    // Crear el árbol n-ario predefinido
createNAryTree() {
    const root = new NAryTreeNode('A');
    const b = new NAryTreeNode('B');
    const c = new NAryTreeNode('C');
    const d = new NAryTreeNode('D');
    const e = new NAryTreeNode('E');
    const f = new NAryTreeNode('F');
    const g = new NAryTreeNode('G');
    const h = new NAryTreeNode('H');
    const i = new NAryTreeNode('I');
    const j = new NAryTreeNode('J');
    const k = new NAryTreeNode('K');
    const l = new NAryTreeNode('L');
    const m = new NAryTreeNode('M');
    const n = new NAryTreeNode('N');
    const ñ = new NAryTreeNode('Ñ');
    const o = new NAryTreeNode('O');
    const p = new NAryTreeNode('P');
    const q = new NAryTreeNode('Q');
    const r = new NAryTreeNode('R');

    // Asignar hijos según la descripción
    root.children.push(b, c); // Hijos de A
    b.children.push(d, e, f); // Hijos de B
    c.children.push(g, h, i); // Hijos de C
    e.children.push(j, k);    // Hijos de E
    g.children.push(l, m, n); // Hijos de G
    h.children.push(ñ, o, p); // Hijos de H
    j.children.push(q);       // Hijo de J
    k.children.push(r);       // Hijo de K

    const tree = new NAryTree();
    tree.root = root;
    return tree;
}


drawTree(root) {
    if (!root) return;

    // Limpiar canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Función para calcular el ancho total del subárbol
    const calculateSubtreeWidth = (node) => {
        if (!node || node.children.length === 0) return 1; // Nodo hoja
        return node.children.reduce((sum, child) => sum + calculateSubtreeWidth(child), 0);
    };

    // Asignar posiciones a los nodos
    const assignPositions = (node, x, y, xOffset) => {
        if (!node) return;

        node._x = x; // Asignar posición horizontal
        node._y = y; // Asignar posición vertical

        const totalChildWidth = calculateSubtreeWidth(node);
        let currentX = x - (totalChildWidth - 1) * xOffset / 2;

        node.children.forEach((child) => {
            const childWidth = calculateSubtreeWidth(child);
            assignPositions(child, currentX, y + 100, xOffset / 1.5); // Reducir distancia para mejor ajuste
            currentX += childWidth * xOffset;
        });
    };

    // Dibujar líneas entre nodos
    const drawConnections = (node) => {
        if (!node) return;

        node.children.forEach((child) => {
            this.ctx.beginPath();
            this.ctx.moveTo(node._x, node._y + 20);
            this.ctx.lineTo(child._x, child._y - 20);
            this.ctx.stroke();
            drawConnections(child);
        });
    };

    // Dibujar nodos
    const drawNodes = (node) => {
        if (!node) return;

        this.ctx.beginPath();
        this.ctx.arc(node._x, node._y, 20, 0, 2 * Math.PI);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.stroke();
        this.ctx.fillStyle = 'black';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(node.value, node._x, node._y);

        node.children.forEach((child) => drawNodes(child));
    };

    // Calcular las posiciones iniciales y dibujar
    const totalWidth = this.canvas.width - 100; // Espacio horizontal disponible
    const subtreeWidth = calculateSubtreeWidth(root);
    assignPositions(root, this.canvas.width / 2, 50, totalWidth / subtreeWidth);
    drawConnections(root);
    drawNodes(root);
}


    // Recorridos del árbol
    bfs(root) {
        const queue = [root];
        const result = [];
        while (queue.length > 0) {
            const current = queue.shift();
            result.push(current.value);
            queue.push(...current.children);
        }
        return result;
    }

    preorder(node, result = []) {
        if (!node) return result;
        result.push(node.value);
        node.children.forEach(child => this.preorder(child, result));
        return result;
    }

    inorder(node, result = []) {
        if (!node) return result;

        const mid = Math.floor(node.children.length / 2);
        for (let i = 0; i < mid; i++) {
            this.inorder(node.children[i], result);
        }

        result.push(node.value);

        for (let i = mid; i < node.children.length; i++) {
            this.inorder(node.children[i], result);
        }

        return result;
    }

    postorder(node, result = []) {
        if (!node) return result;
        node.children.forEach(child => this.postorder(child, result));
        result.push(node.value);
        return result;
    }

    // Mostrar el árbol y sus recorridos
    displayTreeAndTraversals() {
        // Dibujar el árbol en el canvas
        this.drawTree(this.nAryTree.root);

        // Calcular y mostrar los recorridos
        const bfsResult = this.bfs(this.nAryTree.root);
        const preorderResult = this.preorder(this.nAryTree.root);
        const inorderResult = this.inorder(this.nAryTree.root);
        const postorderResult = this.postorder(this.nAryTree.root);

        // Mostrar los resultados
        this.outputDiv.innerHTML = `
            <p><strong>Amplitud:</strong> ${bfsResult.join(', ')}</p>
            <p><strong>Preorden:</strong> ${preorderResult.join(', ')}</p>
            <p><strong>Inorden:</strong> ${inorderResult.join(', ')}</p>
            <p><strong>Postorden:</strong> ${postorderResult.join(', ')}</p>
        `;
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    new NAryTreeApp();
});
