import { useState, useEffect } from "react";
import { API } from "../../api";

export type Winery = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const WineryEditForm: React.FC = () => {
  const [winery, setWinery] = useState<Winery>({
    id: "",
    name: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    if (winery.id) {
      // buscar dados da vinícola no backend e atualizar o estado
      API.get<Winery>(`/vinicolas/${winery.id}`, { responseType: "json" })
        .then((response) => {
          setWinery(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [winery.id]);

  const handleEditVinicola = () => {
    // enviar dados atualizados da vinícola para o backend
    const updatedWinery = { ...winery };
    delete updatedWinery.id;
    API.put<Winery>(`/vinicolas/${winery.id}`, updatedWinery, { responseType: "json" })
      .then((response) => {
        console.log("Winery updated:", response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-3xl font-naveidBd mt-8 mb-8 paragraph">
        Editar Vinícola
      </h1>
      <form
        onSubmit={handleEditVinicola}
        className="bg-[#f6f6f6] py-6 px-6 rounded-md shadow-xl md:w-2/3 lg:w-[80vw] mx-auto border-2 border-[#fc9f32]"
      >
        <div className="flex flex-col md:flex-row">
          <label className="block mb-4 mt-2 text-gray-700 md:w-1/4 font-naveidRg items-center">
            Nome*:
          </label>
          <input
            type="text"
            name="name"
            className="block w-full rounded-md shadow-lg mb-4 border-[#fc9f32] focus:border-[#ae1b1e] focus:ring focus:ring-[#fc9f32] md:w-4/4"
            value={winery.name}
            onChange={(e) => setWinery({ ...winery, name: e.target.value })}
          />

          <label className="block mb-4 ml-10 mt-2 text-gray-700 md:w-2/4 font-naveidRg items-center">
            URL da imagem*:
          </label>
          <input
            type="text"
            name="image"
            className="block w-full border-[#fc9f32] rounded-md shadow-lg mb-4 focus:border-[#ae1b1e] focus:ring focus:ring-[#fc9f32] md:w-4/4"
            value={winery.image}
            onChange={(e) => setWinery({ ...winery, image: e.target.value })}
          />
        </div>
        <label className="block mb-2 text-gray-700 font-naveidRg">
          Descrição*:
        </label>
        <textarea
          className="block w-full border-[#fc9f32] rounded-md shadow-lg mb-4 focus:border-[#ae1b1e] focus:ring focus:ring-[#fc9f32] resize-none"
          rows={4}
          value={winery.description}
          name="description"
          onChange={(e) =>
            setWinery({ ...winery, description: e.target.value })
          }
        ></textarea>
      </form>
      <button
        className="gradient text-white font-gilroyLt py-2 px-6 rounded-lg mt-8"
        onClick={handleEditVinicola}
      >
        Editar
      </button>
    </div>
  );
};

export default WineryEditForm;
