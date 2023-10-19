
// The theory of relativity relates space and time together.
// However, Homestuck breaks the laws of physics, which aren't laws so much as rules
// that get less stable the further out you go from a universe.

// For simplicity, let's have space and time can be separate properties.
// Since time of one universe is independent from another, this is convenient.

// Additionally, JavaScript only allows datetimes within 100 million seconds of 1970-1-1.
// But since there are events that happened, say, 413 million years ago, there will need to be a workaround.

// And finally, how are universes named? When does a character hear of a different universe's existence or its name?
// Universe > Name > Fact > Timeline point > Universe
//
// There is a recursive structure...
// ...or is there?

// We will have "NamedThing" wrap objects with their names. Thus Name > Universe instead of Universe > Name

let ParadoxSpace
class Space {
  static inside = Space
  
  /**
   * @param {Space} parent - A superspace of the given space
   */
  constructor (parent) {
    this.parent = parent ?? (ParadoxSpace ??= this)
    if (space.findSuperspaceOfKind(this.constructor.inside) === undefined) {
      throw new TypeError(`${this.constructor} must be in ${kind}`)
    }
  }

  *superspaces () {
    for (let p = this; p !== Space.ParadoxSpace; p = p.parent) {
      yield p
    }
    yield Space.ParadoxSpace
  }

  /// Whether this space is a subspace of another space, i.e. is entirely inside that space
  isSubspaceOf (space) {
    for (const supasp of this.superspaces()) {
      if (space === supasp) {
        return true
      }
    }
  }

  isSuperspaceOf (subspace) {
    return subspace.isSubspaceOf(this)
  }

  /// Returns a superspace of the given kind, or undefined if no such superspace was found
  findSuperspaceOfKind (kind) {
    for (const supasp of this.superspaces()) {
      if (supasp instanceof kind) {
        return supasp
      }
    }
  }

  universe () {
    return findSuperspaceOfKind(Universe)
  }
}

function requireSuperspace(cls) {
  return class RequireSuperspace extends Subspace {
    constructor (space) {
      super(space)
      if (space.findSuperspaceOfKind(kind) === undefined) {
        throw new TypeError(`${this.constructor} must be in ${kind}`)
      }
    }
  }
}

class Universe extends Space {}

class Planet extends Space {}

class Neighborhood extends Space {}

class Building extends Space {}

class Home extends Building {}
class Hive extends Building {}

class Room extends Space {
  // a Room is in a Building
  static inside = Building
}

export {
  Universe,
  ParadoxSpace: Space.ParadoxSpace,
  Planet,
  Neighborhood,
  Building,
  Home,
  Hive,
  Room,
}

const NANOSECOND = 1n
const MICROSECOND = NANOSECOND * 1000n
const MILLISECOND = MICROSECOND * 1000n
const SECOND = MILLISECOND * 1000n
const MINUTE = SECOND * 60n
const HOUR = MINUTE * 60n

// A second is the time it takes for light to travel some distance in a vaccum
// and so is constant.

// In constrast, a day is how long it takes for the Earth to rotate on its axis,
// and a year is how long it takes for the Earth to go around the sun.

// In general, days become ever so slightly longer as time goes on, as Earth's rotation
// gets slower due to tidal forces associated with the moon.
// https://en.wikipedia.org/wiki/Day_length_fluctuations
// https://en.wikipedia.org/wiki/%CE%94T_(timekeeping)
const TAI_DAY = HOUR * 24n
const COMMON_YEAR = TAI_DAY * 365n
const LEAP_YEAR = COMMON_YEAR + TAI_DAY

// It is not clear if this was accounted for in the million year clocks
// It is possible that these clocks got lucky as the length of a year is relatively constant
// Here I am using Google's conversion rate but perhaps a more accurate measure can be done
const EARTH_YEAR = SECOND * 31556926n
//               = 365 days + 1/4 days + 1/128 days + 1 second (if 1 day = 24 hours)
// 1/4 days + 1/128 days is matt parker's theoretically more accurate leap day to year allocation,
// for simplicity over the current system which excludes every century except every four centuries (2000 is a leap year but 2100 isnt)

// We will assume that Homestuck Earths have the same calendar system
// and leap seconds and timezones are as in this universe

function formatYear(bigint) {
  if (bigint < 0) return '-' + formatYear(-bigint)
  return String(bigint).padStart('0', 4)
}

function offsetDateString(repr, offset) {
  repr = repr.split(' ')
  repr[3] = formatYear(BigInt(repr[3]) + offset)
  return repr.join(' ')
}

// An instant is immutable
class Instant extends Date {
  constructor (...args) {
    let offsetYears = 0n
    if (typeof args[0] === "bigint") {
      offsetYears = args.shift()
      if (args.length === 1) {throw new Error("TODO: new Instant(bigintms)")}
    }
    super(...args)
    if (isNaN(this)) {
      console.warn("Invalid time! Perhaps it was out of range. Have the first parameter be a bigint that is an offset in years", args)
    }
  }

  static UTC (...args) {
    throw new Error("TODO")
  }

  /// @return {bigint}
  valueOf () {
    return BigInt(super.valueOf()) + offsetYears * 31556926_000n
  }

  toString () {
    return offsetDateString(super.toString(), this.offset)
  }

  toDateString () {
    return offsetDateString(super.toDateString(), this.offset)
  }

  toLocaleDateString () {
    return offsetDateString(super.toLocaleDateString(), this.offset)
  }

  toISOString () {
    return offsetDateString(super.toISOString(), this.offset)
  }

  toString () {
    return offsetDateString(super.toString(), this.offset)
  }

  toUTCString () {
    return offsetDateString(super.toUTCString(), this.offset)
  }
}
