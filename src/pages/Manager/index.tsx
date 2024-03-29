import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BiEdit, BiTrash } from "react-icons/bi";
import { API } from "../../api";
import { Winery } from "./../EditWinery/index";
import { AxiosResponse, AxiosError } from "axios";

const Manager = (): JSX.Element => {
  const [vinicolas, setVinicolas] = useState<Winery[]>([]);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<Winery | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [vinicolaToDelete, setVinicolaToDelete] = useState<Winery | null>(null);
  const [editingWinery, setEditingWinery] = useState<Winery | null>(null);

  useEffect(() => {
    async function fetchVinicolas() {
      try {
        const response = await API.get<Winery[]>("/vinicolas");
        setVinicolas(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetchVinicolas();
  }, []);

  const navigate = useNavigate();

  const handleDelete = (vinicola: Winery): void => {
    API.delete(`/vinicolas/${vinicola.id}`, {
      responseType: "json",
      headers: { "Content-Type": "application/json" },
    })
      .then((response: AxiosResponse) => {
        console.log("Winery deleted:", response.data);
        setDeleted(vinicola);
        setVinicolas((prevVinicolas) =>
          prevVinicolas.filter((v) => v.id !== vinicola.id)
        );
      })
      .catch((error: AxiosError) => {
        console.error(error);
      })
      .finally(() => {
        setDeleting(false);
        setShowModal(false);
        setVinicolaToDelete(null);
      });
  };

  const handleEditWinery = (e: React.FormEvent, vinicola: Winery): void => {
    e.preventDefault();
    API.put(`/vinicolas/${vinicola.id}`, vinicola, {
      responseType: "json",
      headers: { "Content-Type": "application/json" },
    })
      .then((response: AxiosResponse) => {
        console.log("Winery updated:", response.data);
        setEditingWinery(null);
      })
      .catch((error: AxiosError) => {
        console.error(error);
      });
  };

  return (
    <div className="max-w-full max-h-screen overflow-x-auto mt-12 px-8">
      <table className="table table-auto w-full min-w-max border border-collapse shadow-xl">
        <thead>
          <tr className="text-center gradient text-gray-700 font-gilroyLt">
            <th className="py-4 px-4 text-white">Nome</th>
            <th className="py-2 px-4 text-white">Descrição</th>
            <th className="py-2 px-4 text-white">Editar</th>
            <th className="py-2 px-2 text-white">Excluir</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#fc9f32]">
          {vinicolas.map((winery: Winery) => (
            <tr key={winery.id} className="hover:bg-gray-200 font-gilroyLt">
              <td className="py-4 px-6">{winery.name}</td>
              <td className="py-4 px-6">{winery.description}</td>
              <td className="py-4 px-2 text-center">
                {editingWinery?.id === winery.id ? (
                  <form
                    onSubmit={(e) => handleEditWinery(e, editingWinery)}
                    className="flex flex-col gap-2"
                  >
                    <label htmlFor="name">Nome</label>
                    <input
                      type="text"
                      name="name"
                      value={editingWinery.name}
                      onChange={(e) =>
                        setEditingWinery({
                          ...editingWinery,
                          name: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:ring focus:ring-[#fc9f32] focus:outline-none"
                    />
                    <label htmlFor="description">Descrição</label>
                    <textarea
                      name="description"
                      value={editingWinery.description}
                      onChange={(e) =>
                        setEditingWinery({
                          ...editingWinery,
                          description: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:ring focus:ring-[#fc9f32] focus:outline-none"
                    ></textarea>
                    <label htmlFor="image">Imagem</label>
                    <input
                      type="text"
                      name="image"
                      value={editingWinery.image}
                      onChange={(e) =>
                        setEditingWinery({
                          ...editingWinery,
                          image: e.target.value,
                        })
                      }
                      className="border border-gray-300 rounded-md px-2 py-1 focus:ring focus:ring-[#fc9f32] focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="gradient text-white font-gilroyLt py-2 px-4 rounded-lg"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingWinery(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white font-gilroyLt py-2 px-4 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setEditingWinery({ ...winery })}
                    className="text-3xl text-gray-500"
                  >
                    <BiEdit />
                  </button>
                )}
              </td>

              <td className="py-4 px-2 text-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setVinicolaToDelete(winery);
                    setShowModal(true);
                  }}
                >
                  <BiTrash className="text-3xl text-[#ae1b1e]" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {deleting && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-400"></div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8 mx-8 md:mx-0">
            <h2 className="text-2xl font-naveidBd mb-6">Excluir Vinícola</h2>
            <p className="mb-6 font-naveidLt">
              Tem certeza que deseja excluir a vinícola{" "}
              <span className="font-bold">
                {vinicolaToDelete && vinicolaToDelete.name}
              </span>
              ?
            </p>
            <div className="flex justify-around font-gilroyLt">
              <button
                className="gradient text-white px-4 py-2 rounded mr-4"
                onClick={() => handleDelete(vinicolaToDelete as Winery)}
              >
                Excluir
              </button>
              <button
                className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <button className="py-2 px-4 mt-10 gradient rounded-xl shadow-lg text-white">
          <Link to="/winerynew">Cadastrar Nova Vinícola</Link>
        </button>
      </div>
    </div>
  );
};

export default Manager;
