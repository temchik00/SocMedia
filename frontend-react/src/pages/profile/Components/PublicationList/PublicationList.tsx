import "./PublicationList.scss";
import { FC, useContext } from "react";
import Publication from "../Publication/Publication";
import { ProfileContext } from "../../../../shared/profileContext";

const PublicationList: FC<{}> = () => {
    const { publications } = useContext(ProfileContext);

    const publicationComponents = publications.map((publication) => {
        return <Publication key={publication.id} publication={publication} />;
    });

    return <div className="PublicationList">{publicationComponents}</div>;
};

export default PublicationList;
