import React, { useState } from "react";

interface Enemy {
  name: string;
  distance: number;
  speed: number;
}

const TowerDefenseGame: React.FC = () => {
  const [towerRange, setTowerRange] = useState<number>(50);
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
    if (enemies.length >= 9) {
      alert("Вы не можете добавить больше 9 врагов.");
      return;
    }
    let randomName = "";
    let isUnique = false;

    // Повторяем генерацию имени до тех пор, пока не найдем уникальное
    while (!isUnique) {
      randomName = `Bot${Math.floor(Math.random() * 9) + 1}`;

      // Проверяем, существует ли такое имя среди уже добавленных врагов
      if (!enemies.some((enemy) => enemy.name === randomName)) {
        isUnique = true;
      }
    }

    // Генерация случайной дистанции, кратной 10 от 10 до 150
    const randomDistance = Math.floor(Math.random() * 15) * 10 + 10;

    // Генерация случайной скорости, кратной 5 от 5 до 30
    const randomSpeed = (Math.floor(Math.random() * 6) + 1) * 5;

    setEnemies([
      ...enemies,
      { name: randomName, distance: randomDistance, speed: randomSpeed },
    ]);
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

      if (defeated) {
        setTowerRange(towerRange * 2);
      }

      step++;
    }

    if (!defeated) {
      setGameResult(`Башня ВЫИГРЫВАЕТ за ${currentTurn} хода(ов)`);
      console.log(`Башня ВЫИГРЫВАЕТ за ${currentTurn} хода(ов)`);
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
    if (enemies.length === 0 || turns === 0) {
      console.log("Набор врагов пуст или количество ходов равно 0");
      return;
    }

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
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border w-[1200px] border-emerald-500 px-12 rounded-md py-10">
      <h1 className="text-2xl text-center mb-5 ">Игра "Защита башни"</h1>
      <div className="mb-5 mx-auto flex items-center justify-center space-x-4">
        <label className="text-lg">Дальность стрельбы башни:</label>
        <input
          className="tex-xl w-[250px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
          type="number"
          value={towerRange}
          onChange={(e) => setTowerRange(parseInt(e.target.value))}
        />
        <button
          className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
          onClick={handleAddEnemy}>
          Добавить врага
        </button>
        <button
          className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
          onClick={startGame}>
          Начать игру
        </button>
      </div>
      <div className="border m-auto w-[750px] relative px-4 py-8 rounded border-emerald-500">
        <h2 className="top-0 left-0 bg-emerald-500 rounded text-lg absolute text-white w-fit p-1">
          Список врагов
        </h2>

        <p className="text-sm bg-emerald-500 rounded text-white p-1 absolute top-0 right-0">
          Кликните 2 раза на врага, чтобы изменить его параметры
        </p>

        {enemies.map((enemy, index) => (
          <div key={index}>
            <div
              className={`border m-2 rounded p-2 ${
                editingIndex === index ? "animate-pulse" : ""
              }`}>
              {editingIndex === index ? (
                <>
                  <label className="text-lg m-4">Имя врага:</label>
                  <input
                    className="tex-xl w-[120px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="text"
                    value={enemy.name}
                    onChange={(e) => handleInputChange(e, index, "name")}
                  />
                  <label className="text-lg m-4">Начальное расстояние:</label>
                  <input
                    className="tex-xl w-[120px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="number"
                    value={enemy.distance}
                    onChange={(e) => handleInputChange(e, index, "distance")}
                  />
                  <label className="text-lg m-4">Скорость:</label>
                  <input
                    className="tex-xl w-[120px] p-2  border border-emerald-500 rounded outline-none  mx-2 hover:border-sky-600 focus:border-sky-600 transition-colors duration-300"
                    type="number"
                    value={enemy.speed}
                    onChange={(e) => handleInputChange(e, index, "speed")}
                  />
                  <button
                    className="bg-emerald-500 text-white p-2 rounded-md border border-emerald-500 hover:bg-emerald-600 transition-colors duration-300"
                    onClick={() => handleSaveChanges(index)}>
                    Сохранить
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    Имя врага: {enemy.name}
                  </span>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    Начальное расстояние: {enemy.distance}
                  </span>
                  <span
                    className="text-lg m-4"
                    onDoubleClick={() => toggleEditMode(index)}>
                    Скорость: {enemy.speed}
                  </span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className=" mt-5 text-2xl text-center">
        {gameResult && (
          <p
            className={
              gameResult.includes("ВЫИГРЫВАЕТ")
                ? "text-emerald-500 font-bold"
                : "text-red-500 font-bold"
            }>
            {gameResult}
          </p>
        )}
      </div>
    </div>
  );
};

export default TowerDefenseGame;
