import { useEffect, useRef } from 'react';
import './moveInViewport.scss';
import { Positions } from '../../constants/helper';

const MoveInViewPort = ({
    anchorEl,
    position = Positions.bottom,
    offsetObj,
    children,
}: any) => {
    const contentEleRef = useRef<any>(null);

    useEffect(() => {
        const calculatePosition = () => {
            const contentEle = contentEleRef.current;

            if (!contentEle || !anchorEl.current) {
                return;
            }

            const contentRect = contentEle.getBoundingClientRect();
            const anchorRect = anchorEl.current.getBoundingClientRect();
            const contentHeight = contentRect.height;
            const contentWidth = contentRect.width;
            const anchorHeight = anchorRect.height;
            const anchorWidth = anchorRect.width;

            const bottomOffset =
                offsetObj && offsetObj.bottom ? offsetObj.bottom : 0;
            const rightOffset =
                offsetObj && offsetObj.right ? offsetObj.right : 0;
            let top, left;

            switch (position) {
                case Positions.bottom:
                    top = anchorRect.bottom;
                    left = anchorRect.left + (anchorWidth - contentWidth) / 2;
                    break;
                case Positions.top:
                    top = anchorRect.top - contentHeight;
                    left = anchorRect.left + (anchorWidth - contentWidth) / 2;
                    break;
                case Positions.right:
                    top = anchorRect.top + (anchorHeight - contentHeight) / 2;
                    left = anchorRect.right + rightOffset;
                    break;
                case Positions.left:
                    top = anchorRect.top + (anchorHeight - contentHeight) / 2;
                    left = anchorRect.left - contentWidth - rightOffset;
                    break;

                case Positions.bottomEnd:
                    top = anchorRect.bottom;
                    left =
                        anchorRect.left +
                        anchorRect.width -
                        contentWidth +
                        rightOffset;
                    break;

                case Positions.bottomStart:
                    top = anchorRect.bottom;
                    left = anchorRect?.left;

                    break;

                default:
                    break;
            }

            // Check if content is visible inside the viewport or not
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;
            if (top + contentHeight + bottomOffset > viewportHeight) {
                top = viewportHeight - contentHeight - offsetObj.bottom;
            }
            if (left + contentRect.width + rightOffset > viewportWidth) {
                left = viewportWidth - contentRect.width - offsetObj.right;
            }

            //setting top and left of the positionObject
            const positionObj: { [key: string]: string | number } = {
                top: `${top}px`,
                left: `${left}px`,
            };

            Object.keys(positionObj).forEach((item: any) => {
                contentEle.style[item] = positionObj[item];
            });

            contentEle.classList.add('visible');
        };

        // Timeout is used for React to completely render his children
        const timeoutId = setTimeout(() => {
            calculatePosition();
        }, 100);

        return () => clearTimeout(timeoutId);
    }, []);

    return (
        <div ref={contentEleRef} className="view-port-content-container">
            {children}
        </div>
    );
};

export default MoveInViewPort;
