import React, { useState } from "react";

interface Enemy {
  name: string;
  distance: number;
  speed: number;
}

const TowerDefenseGame: React.FC = () => {
  const [towerRange, setTowerRange] = useState<number>(0);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [turns, setTurns] = useState<number>(0);
  const [gameResult, setGameResult] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    key: keyof Enemy
  ) => {
    const newEnemies = [...enemies];
    newEnemies[index] = {
      ...newEnemies[index],
      [key]: parseInt(e.target.value),
    };
    setEnemies(newEnemies);
  };

  const handleSaveChanges = (index: number) => {
    setEditingIndex(null);
  };

  const handleAddEnemy = () => {
    const randomName = `Bot${Math.floor(Math.random() * 9) + 1}`;

    const randomDistance = Math.floor(Math.random() * 15) * 10 + 10;

    const randomSpeed = (Math.floor(Math.random() * 6) + 1) * 5;

    setEnemies([
      ...enemies,
      { name: randomName, distance: randomDistance, speed: randomSpeed },
    ]);

    let maxDistance = Math.max(...enemies.map((enemy) => enemy.distance), 0);
    setTowerRange(maxDistance);
  };

  const startGame = () => {
    if (
      enemies.length === 0 ||
      enemies.some((enemy) => enemy.name.trim() === "")
    ) {
      setGameResult("Добавьте врагов с корректными именами перед началом игры");
      return;
    }
    playTurns();
  };

  const playTurns = () => {
    let currentTurn = 0;
    let step = 1;
    let defeated = false;

    while (enemies.length > 0 && !defeated) {
      currentTurn++;
      let closestEnemyIndex = -1;
      let minDistance = towerRange;

      for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        if (enemy.distance <= towerRange) {
          if (enemy.distance < minDistance) {
            minDistance = enemy.distance;
            closestEnemyIndex = i;
          }
        }
      }

      if (closestEnemyIndex !== -1) {
        const closestEnemy = enemies[closestEnemyIndex];
        console.log(
          ` Ход ${currentTurn}: Убит ${closestEnemy.name} на дистанции в ${closestEnemy.distance} м`
        );
        enemies.splice(closestEnemyIndex, 1);
      }

      enemies.forEach((enemy) => {
        enemy.distance -= enemy.speed;
        if (enemy.distance <= 0) {
          defeated = true;
        }
      });

      console.log(
        `Расстояние до врагов после Шага ${step}, Хода ${currentTurn}:`,
        enemies.map((enemy) => `${enemy.name}: ${enemy.distance}м`)
      );

      if (defeated) {
        setTowerRange(towerRange * 2);
      }

      step++;
    }

    if (!defeated) {
      setGameResult(`Башня ВЫИГРЫВАЕТ за ${currentTurn} ходов`);
    } else {
      setGameResult(`Башня ПРОИГРЫВАЕТ`);
      calculateMinimumTowerRange();
    }

    setTurns(currentTurn);
  };

  const toggleEditMode = (index: number) => {
    setEditingIndex(index === editingIndex ? null : index);
  };

  const calculateMinimumTowerRange = () => {
    let maxSpeed = 0;
    enemies.forEach((enemy) => {
      if (enemy.speed > maxSpeed) {
        maxSpeed = enemy.speed;
      }
    });
    const minRange = maxSpeed * turns;
    console.log(
      `Минимальная дальность стрельбы башни для победы: ${minRange} м`
    );
  };

  return (
    <div>
      <h1>Игра "Защита башни"</h1>
      <label>Дальность стрельбы башни:</label>
      <input type="number" value={towerRange} disabled />
      {enemies.map((enemy, index) => (
        <div key={index}>
          {editingIndex === index ? (
            <>
              <label>Имя врага:</label>
              <input
                type="text"
                value={enemy.name}
                onChange={(e) => handleInputChange(e, index, "name")}
              />
              <label>Начальное расстояние:</label>
              <input
                type="number"
                value={enemy.distance}
                onChange={(e) => handleInputChange(e, index, "distance")}
              />
              <label>Скорость:</label>
              <input
                type="number"
                value={enemy.speed}
                onChange={(e) => handleInputChange(e, index, "speed")}
              />
              <button onClick={() => handleSaveChanges(index)}>
                Сохранить
              </button>
            </>
          ) : (
            <>
              <span onDoubleClick={() => toggleEditMode(index)}>
                Имя врага: {enemy.name}
              </span>
              <span onDoubleClick={() => toggleEditMode(index)}>
                Начальное расстояние: {enemy.distance}
              </span>
              <span onDoubleClick={() => toggleEditMode(index)}>
                Скорость: {enemy.speed}
              </span>
            </>
          )}
        </div>
      ))}
      <button onClick={handleAddEnemy}>Добавить врага</button>
      <button onClick={startGame}>Начать игру</button>
      {gameResult && <p>{gameResult}</p>}
    </div>
  );
};

export default TowerDefenseGame;
