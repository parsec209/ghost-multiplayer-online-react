import { useEffect, useRef, FC } from "react";

interface FallingTilesProps {
  areFalling: boolean;
}

interface Tile {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  velocityX: number;
  velocityY: number;
  gravity: number;
  size: number;
  letter: string;
  update: () => void;
  draw: () => void;
}

const FallingTiles: FC<FallingTilesProps> = ({ areFalling }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tiles = useRef<Tile[]>([]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    function Tile(x: number, y: number, size: number, letter: string): Tile {
      return {
        x,
        y,
        width: size * 20,
        height: size * 20,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 2 - 1,
        velocityX: Math.random() * 2 - 1,
        velocityY: Math.random() * 0.5 + 0.1,
        gravity: 0.02,
        size,
        letter,

        update() {
          this.rotation += this.rotationSpeed;
          this.velocityY += this.gravity;
          this.x += this.velocityX;
          this.y += this.velocityY;

          if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
            this.velocityY *= -0.4;
          }

          if (this.x + this.width < 0 || this.x > canvas.width) {
            removeTile(this);
          }
        },

        draw() {
          if (!ctx) return;
          ctx.save();
          ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
          ctx.rotate((this.rotation * Math.PI) / 180);
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
          );
          ctx.font = `bold ${this.size * 16}px Arial`;
          ctx.fillStyle = "#000000";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(this.letter, 0, 0);
          ctx.restore();
        },
      };
    }

    function generateRandomLetter() {
      const charCode = 65 + Math.floor(Math.random() * 26);
      return String.fromCharCode(charCode);
    }

    function createTiles() {
      const numOfTiles = 100;
      for (let i = 0; i < numOfTiles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * -canvas.height;
        const size = Math.random() * 2 + 0.5;
        const letter = generateRandomLetter();
        tiles.current.push(new (Tile as any)(x, y, size, letter));
      }
    }

    function removeTile(tile: Tile) {
      const index = tiles.current.indexOf(tile);
      if (index > -1) {
        tiles.current.splice(index, 1);
      }
    }

    function animate() {
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      tiles.current.forEach((tile) => {
        tile.update();
        tile.draw();
      });

      requestAnimationFrame(animate);
    }

    if (areFalling) {
      createTiles();
      animate();
    }

    return () => {
      tiles.current = [];
    };
  }, []);

  return <canvas ref={canvasRef} />;
};

export default FallingTiles;
