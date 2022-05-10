const GET_FOODS = `
    select 
        food_id,
        food_name,
        food_img,
        food_price,
        food_created_at,
        food_deleted_at
    from foods
    where 
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
    end asc,
    case 
        when $4 = 'byPrice' and $5 = 1 then food_price
    end desc,
    case 
        when $4 = 'byPrice' and $5 = 2 then food_price
    end asc
    offset $1 limit $2
`

const GET_FOOD = `
    select 
        food_id,
        food_name,
        food_img,
        food_price,
        food_created_at,
        food_deleted_at
    from foods
    where food_id::varchar = $1
`

export default {
    GET_FOODS,
    GET_FOOD
}