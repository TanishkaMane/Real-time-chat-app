import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./overlay.scss";
import { Positions } from "../../constants/helper";
import MoveInViewPort from "../moveInViewPort/moveInViewPort";

interface OverlayProps {
  refElement: React.RefObject<HTMLDivElement>;
  overlayClick: () => void;
  children: React.ReactNode;
  position?: Positions;
  overlayClass?: string;
  layer?: number;
  moveInViewport?: boolean;
  moveInViewportOffset?: any;
}

const OverlayElement = ({
  refElement,
  overlayClick,
  children,
  position = Positions.bottom,
  overlayClass = "",
  layer = 0,
  moveInViewport = false,
  moveInViewportOffset = void 0,
}: OverlayProps) => {
  const [childPosition, setChildPosition] = useState<{
    top: "auto";
    bottom: "auto";
    left: "auto";
    right: "auto";
    transform: "";
  }>({
    top: "auto",
    bottom: "auto",
    left: "auto",
    right: "auto",
    transform: "",
  });

  const updatePosition = () => {
    if (refElement.current) {
      const anchorDimensions = refElement.current.getBoundingClientRect();
      let updatedPosition: any = {};

      switch (position) {
        case Positions.top:
          updatedPosition = {
            top: anchorDimensions?.height - anchorDimensions?.bottom,
            left: anchorDimensions?.left - anchorDimensions?.width,
            transform: "TranslateY(-50%)",
          };

          break;

        case Positions.left:
          updatedPosition = {
            top: anchorDimensions?.height - anchorDimensions?.top,

            left: anchorDimensions?.right - anchorDimensions?.width,
            transform: "TranslateX(-100%)",
          };

          break;

        case Positions.right:
          updatedPosition = {
            top: anchorDimensions?.height - anchorDimensions?.top,
            // transform: 'TranslateY(-50%)',

            left: anchorDimensions?.left - anchorDimensions?.width,
          };

          break;

        case Positions.bottom:
          updatedPosition = {
            top: anchorDimensions?.bottom,

            left: anchorDimensions.left + anchorDimensions.width / 2,
            transform: "TranslateX(-50%)",
          };

          break;

        case Positions.bottomStart:
          updatedPosition = {
            top: anchorDimensions?.bottom,

            left: anchorDimensions?.left,
          };

          break;

        case Positions.bottomEnd:
          updatedPosition = {
            top: anchorDimensions?.bottom,
            left: anchorDimensions?.right,
            transform: "TranslateX(-100%)",
          };

          break;

        case Positions.topStart:
          updatedPosition = {
            top: anchorDimensions?.top,

            right: screen.width - anchorDimensions?.left,
            transform: "TranslateY(-100%)",
          };

          break;

        case Positions.topEnd:
          updatedPosition = {
            top: anchorDimensions?.height - anchorDimensions.top,

            left: anchorDimensions?.right,
            transform: "TranslateY(-50%)",
          };

          break;

        case Positions.leftEnd:
          updatedPosition = {
            top: anchorDimensions?.bottom,
            transform: "TranslateX(50%)",

            right: anchorDimensions?.right - window.screen.height,
          };

          break;

        case Positions.leftStart:
          updatedPosition = {
            top: anchorDimensions?.top,

            right: screen.width - anchorDimensions?.left,
          };

          break;

        case Positions.rightEnd:
          updatedPosition = {
            top: anchorDimensions?.bottom,
            left: anchorDimensions?.right,
          };

          break;

        case Positions.rightStart:
          updatedPosition = {
            top: anchorDimensions?.top,

            left: anchorDimensions?.right,
          };

          break;

        default:
          break;
      }

      setChildPosition((prevState: any) => {
        return {
          ...prevState,
          ...updatedPosition,
        };
      });
    }
  };

  useEffect(() => {
    // Initial position update
    if (!moveInViewport) {
      updatePosition();

      // Update position on resize
      window.addEventListener("resize", updatePosition);
    }

    return () => {
      if (!moveInViewport) {
        window.removeEventListener("resize", updatePosition);
      }
    };
  }, []);

  return (
    <>
      {childPosition &&
        createPortal(
          <>
            <div
              className={`overlay-container ${overlayClass}`}
              onClick={overlayClick} // Close overlay when clicked
              style={{ zIndex: 999 + layer }}
            ></div>
            {moveInViewport ? (
              <div className="overlay-child" style={{ zIndex: 1000 + layer }}>
                <MoveInViewPort
                  anchorEl={refElement}
                  position={position}
                  offsetObj={
                    moveInViewportOffset || {
                      bottom: 50,
                    }
                  }
                >
                  {children}
                </MoveInViewPort>
              </div>
            ) : (
              <div
                className="overlay-child"
                style={{
                  ...childPosition,
                  zIndex: 1000 + layer,
                }}
              >
                {children}
              </div>
            )}
          </>,
          document.body
        )}
    </>
  );
};

export default OverlayElement;
