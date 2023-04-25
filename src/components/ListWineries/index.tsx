import { useState, useEffect } from "react";
import { API } from "../../api";
import UpdateWinery from "../CrudWinery/UpdateWinery";
import DeleteWinery from "../CrudWinery/DeleteWinery";
import { Vinicola } from "../../types";

import { IProps } from "./types";

const ListWineries
 = ({ vinicolas, categorias, onSubmit }: IProps) => {
  const [vinicolasState, setVinicolasState] = useState<Vinicola[]>(vinicolas);

  useEffect(() => {
    const fetchVinicolas = async () => {
      try {
        const response = await API.get("/vinicolas");
        setVinicolasState(response.data);
      } catch (error) {
        console.error("Erro ao buscar vinícolas:", error);
      }
    };
    fetchVinicolas();
  }, []);

  const handleDelete = (id: number) => {
    setVinicolasState(vinicolasState.filter((vinicola) => vinicola.id !== id));
  };

  const handleUpdate = (vinicolaAtualizada: Vinicola) => {
    setVinicolasState(
      vinicolasState.map((vinicola) =>
        vinicola.id === vinicolaAtualizada.id ? vinicolaAtualizada : vinicola
      )
    );
    onSubmit ? (vinicolaAtualizada) : null;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>País</th>
            <th>Região</th>
            <th>Categoria</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vinicolasState.map((vinicola) => (
            <tr key={vinicola.id}>
              <td>{vinicola.name}</td>
              <td>{vinicola.description}</td>
              <td>{vinicola.image}</td>
              <td>
                <UpdateWinery
                  vinicola={vinicola}
                  categorias={categorias}
                  onSubmit={handleUpdate}
                />
                <DeleteWinery
                  vinicola={vinicola}
                  onDelete={() => handleDelete(vinicola.id!)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListWineries;
