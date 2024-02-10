import { useTranslation } from "react-i18next";
import HomeModal from "../../components/modal";
import { AuthModalContext } from "../../contexts/authModalContext";
import { useContext, useEffect, useState } from "react";
import heroImageNDescription from "../../types/home/heroHome";

const HomeHead = (props: {
  HeroImageNDescription: heroImageNDescription[];
}) => {
  const { t } = useTranslation();
  const authModalCtx = useContext(AuthModalContext);

  const [heroImageNDescriptionIndex, setHeroImageNDescriptionIndex] =
    useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageNDescriptionIndex(
        (heroImageNDescriptionIndex) =>
          (heroImageNDescriptionIndex + 1) % props.HeroImageNDescription.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const openAuthModal = () => {
    authModalCtx.handleOpenAuth();
  };

  return (
    <div className="home-head">
      <div className="home-child-left">
        <div>
          <h1 id="automatic-change">
            {t(props.HeroImageNDescription[heroImageNDescriptionIndex].title)}
          </h1>
          <p id="sub-para">
            {t(
              props.HeroImageNDescription[heroImageNDescriptionIndex]
                .description
            )}
          </p>
        </div>
        <div className="primary-btn cursor_pointer" onClick={openAuthModal}>
          {t(`Get Started`)}
        </div>
        <HomeModal
          open={authModalCtx.openAuth}
          handleClose={authModalCtx.handleCloseAuth}
        />
      </div>

      <div className="home-child-right">
        <div className="right-image">
          {props.HeroImageNDescription[heroImageNDescriptionIndex].image}
        </div>
      </div>
    </div>
  );
};

export default HomeHead;
