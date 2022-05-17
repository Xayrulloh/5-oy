const GET_FOODS = `
    select 
        food_id,
        food_name,
        food_img,
        food_price,
        food_created_at
    from foods
    where 
        food_deleted_at is null and
        food_name ilike concat('%', $3::varchar, '%')
    order by
    case 
        when $4 = 'byDate' and $5 = 1 then food_created_at
    end asc,
    case 
        when $4 = 'byDate' and $5 = 2 then food_created_at
    end desc,
    case 
        when $4 = 'byName' and $5 = 1 then food_name
    end desc,
    case 
        when $4 = 'byName' and $5 = 2 then food_name
    end asc
    offset $1 limit $2
`

const GET_FOOD = `
    select 
        food_id,
        food_name,
        food_img,
        food_price,
        food_created_at
    from foods
    where food_deleted_at is null and 
    food_id::varchar = $1
`

const ADD_FOOD = `
    insert into users (
        food_name,
        food_img,
        food_price
    ) values ($1, $2, $3)
    returning *
`

const CHANGE_FOOD = `
    update foods f set
        food_name = (
            case
                when length($2) > 0 then $2
                else f.food_name
            end
        ),
        food_img = (
            case
                when length($3) > 0 then $3
                else f.food_img
            end
        ),
        food_price = (
            case
                when length($4) > 0 then $4
                else f.price
            end
        )
    where food_deleted_at is null and food_id::varchar = $1
    returning *
`

const DELETE_FOOD = `
    update foods set
        food_deleted_at = current_timestamp
    where food_deleted_at is null and
    food_id::varchar = $1
    returning *
`

export default {
    GET_FOODS,
    ADD_FOOD,
    GET_FOOD,
    DELETE_FOOD,
    CHANGE_FOOD
}