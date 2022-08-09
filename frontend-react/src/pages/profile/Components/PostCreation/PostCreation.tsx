import "./PostCreation.scss";
import { FC, useContext, useEffect, useState } from "react";
import { ProfileContext } from "../../../../shared/profileContext";

const PostCreation: FC = () => {
    const [text, setText] = useState<string>("");
    const [image, setImage] = useState<File | undefined>(undefined);
    const [imageURL, setImageUrl] = useState<string | undefined>(undefined);
    const { postPublication } = useContext(ProfileContext);

    useEffect(() => {
        if (image) setImageUrl(URL.createObjectURL(image));
        else setImageUrl(undefined);
    }, [image]);

    function fileChange(files: FileList | null) {
        if (files && files.length > 0) {
            const file = files[0];
            setImage(file);
        } else {
            setImage(undefined);
        }
    }

    function createPublication() {
        postPublication(text, image);
        setImage(undefined);
        setText("");
    }

    return (
        <div className="panel PostCreation">
            <textarea
                className="textarea"
                placeholder="Текст публикации"
                value={text}
                onChange={(e) => {
                    setText(e.target.value);
                }}
            ></textarea>
            <div className="bottom-container">
                {imageURL && (
                    <div className="attached-image-container">
                        <img src={imageURL} alt="" className="attached-image" />
                    </div>
                )}
                <div className="buttons-container">
                    <div className="base-button attach-button">
                        <img
                            src="/icons/paperclip.svg"
                            alt=""
                            className="paperclip"
                        />
                        <input
                            type="file"
                            className="image-input"
                            onChange={(e) => {
                                fileChange(e.target.files);
                            }}
                        />
                    </div>
                    <button
                        className="base-button send-button"
                        onClick={createPublication}
                    >
                        Опубликовать
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostCreation;
