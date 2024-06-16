import styles from "./Exploration.module.scss";
import { observer } from "mobx-react-lite";
import { Input } from "src/ui/components/inputs/Input/Input.tsx";
import { IconClose, IconFilter, IconSearch, IconSortingArrows } from "src/ui/assets/icons";
import { SelectButton } from "src/ui/components/inputs/SelectButton/SelectButton.tsx";
import { ButtonIcon } from "src/ui/components/controls/ButtonIcon/ButtonIcon.tsx";
import { DropdownListOption } from "src/ui/components/solutions/DropdownList/DropdownList.types.ts";
import { Card } from "src/ui/components/solutions/Card/Card.tsx";
import { Button } from "src/ui/components/controls/Button/Button.tsx";
import { Chip } from "src/ui/components/controls/Chip/Chip.tsx";

export interface FilterChip {
    name: string;
    field: string;
    value: string;
}

interface ExplorationProps {
    inputPlaceholder: string;
    onInputChange: (value: string) => void;
    inputValue: string;
    sortOptions?: DropdownListOption[] | null;
    sortValue?: string | null;
    onSortChange?: (value: string) => void;
    onFilterButtonClick?: () => void;
    filters?: FilterChip[];
    onDeleteFilter?: (field: string, value: string) => void;
    filterCounter?: number;
}

export const Exploration = observer((props: ExplorationProps) => {
    return (
        <Card>
            <div>
                <div className={styles.searchRow}>
                    <div className={styles.input}>
                        <Input
                            placeholder={props.inputPlaceholder}
                            onChange={(event) => props.onInputChange(event.target.value)}
                            types={"text"}
                            value={props.inputValue}
                            startIcon={<IconSearch />}
                            size={"large"}
                            endIcon={
                                props.inputValue && (
                                    <ButtonIcon
                                        mode={"neutral"}
                                        size={"small"}
                                        onClick={() => props.onInputChange("")}
                                    >
                                        <IconClose />
                                    </ButtonIcon>
                                )
                            }
                        />
                    </div>
                    {props.onFilterButtonClick && (
                        <Button
                            type={"outlined"}
                            size={"large"}
                            mode={"neutral"}
                            iconBefore={<IconFilter />}
                            onClick={props.onFilterButtonClick}
                            counter={props.filterCounter}
                        >
                            Фильтры
                        </Button>
                    )}
                    {props.sortOptions && props.sortValue && props.onSortChange && (
                        <SelectButton
                            options={props.sortOptions}
                            value={props.sortValue}
                            onChange={props.onSortChange}
                            mode={"neutral"}
                            buttonType={"tertiary"}
                            buttonSize={"large"}
                            buttonIconBefore={<IconSortingArrows />}
                        />
                    )}
                </div>
                {!!props.filters?.length && (
                    <>
                        <div className={styles.divider} />
                        <div className={styles.filters}>
                            {props.filters.map((filter) => (
                                <Chip
                                    onDelete={() =>
                                        props.onDeleteFilter?.(filter.field, filter.value)
                                    }
                                    key={filter.field + filter.value}
                                >
                                    {filter.name}
                                </Chip>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </Card>
    );
});
