export function formatName(name) {
    if (name.length > 0) {
        let ArrayName = name.split(" ")
        let size = ArrayName.length;
        for (let i = 0; i < size; i++) {
            ArrayName[i] = ArrayName[i].replace(ArrayName[i].charAt(0), ArrayName[i].charAt(0).toUpperCase());
        }
        const nameJoin = ArrayName.join(' ')
        const nameArray = nameJoin.split(' ')
        const nameFilter = nameArray.filter((item) => {
            return item != ''
        })
        const formatName = nameFilter.join(' ')

        return formatName
    }
}

export function formatDate(date) {
    const formatDate = new Date(date)
    const ptBrDate = formatDate.toLocaleDateString('pt-br')

    return ptBrDate
}

export function formatValue(value) {

    const convertedValue = parseInt(value);
    const valueReais = convertedValue * 100

    const valueFormt = valueReais / 100

    const result = valueFormt.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return result
}

export function replaceWhiteSpaces(str) {
    return str.replace(/\s{2,}/g, ' ').trim();
}

export function handleFormatCep(cep) {
    const arrayCep = cep.split('')
    const cepFormat = arrayCep.splice(5, 0, '-')
    const cepJoin = arrayCep.join('')

    return cepJoin
}